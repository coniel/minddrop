import React, { useCallback, useId, useRef, useState } from 'react';
import { isEditableTarget, resolveLazyValue } from '@minddrop/utils';
import { DragStore } from '../DragStore';
import { DraggablesRegistry } from '../DraggablesRegistry';
import { DRAG_THRESHOLD } from '../constants';
import { startDrag } from '../startDrag';
import { DragEffect, DragOrigin, DragPress, DraggableProps } from '../types';
import { isInsideNoDrag } from '../utils';

// Presses an inner draggable has taken. The draggables around it
// leave these alone.
const claimedPresses = new WeakSet<Event>();

export interface UseDraggableOptions<TData extends Record<string, unknown>> {
  /**
   * The ID of the dragged item.
   */
  id: string;

  /**
   * The type of the dragged item.
   */
  type: string;

  /**
   * The drag's data, keyed by data type, or a function returning it
   * when the drag starts.
   */
  data: TData | (() => TData);

  /**
   * Where the drag starts from.
   */
  origin?: DragOrigin;

  /**
   * Whether a drop moves the item from where it was dragged out of
   * or copies it there.
   *
   * @default 'move'
   */
  effect?: DragEffect;

  /**
   * The element shown following the pointer, or a function returning
   * it when the drag starts. The source element when omitted.
   */
  preview?: Element | null | (() => Element | null);

  /**
   * Whether the item cannot be dragged.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Called as the drag starts, before its data is resolved.
   */
  onActivate?: (press: DragPress) => void;
}

export interface UseDraggableReturn {
  /**
   * Props spread onto the element which is dragged.
   */
  draggableProps: DraggableProps;

  /**
   * Whether the item is currently being dragged.
   */
  isDragging: boolean;

  /**
   * Registers the element as the drag's source. Also in the props,
   * exposed for composing with the element's own ref.
   */
  ref: DraggableProps['ref'];
}

/**
 * Makes an element draggable with the pointer.
 *
 * @param options - The dragged item and its data.
 * @returns The props making the element draggable and whether it is being dragged.
 */
export function useDraggable<TData extends Record<string, unknown>>(
  options: UseDraggableOptions<TData>,
): UseDraggableReturn {
  // The key the element is registered under
  const key = useId();
  // The latest options and the element
  const optionsRef = useRef(options);
  const elementRef = useRef<HTMLElement | null>(null);
  // The token of the drag this element last started. Tells its drag
  // from any other item's.
  const [token, setToken] = useState<string | null>(null);
  // Check whether the active drag is this element's
  const isDragging = DragStore(
    (state) => state.active !== null && state.active.token === token,
  );

  // Keep the latest options in reach of the stable handlers
  optionsRef.current = options;

  // Register the element as a drag source, unregistering it on unmount
  const ref = useCallback(
    (element: HTMLElement | null) => {
      // Remember the element
      elementRef.current = element;

      if (!element) {
        return;
      }

      // Register the element as a drag source
      DraggablesRegistry.register({
        key,
        element,
        getId: () => optionsRef.current.id,
        resolvePreview: () =>
          resolveLazyValue(optionsRef.current.preview) ?? null,
      });

      // Unregister it when the element unmounts
      return () => {
        DraggablesRegistry.unregister(key);
        elementRef.current = null;
      };
    },
    [key],
  );

  // Watch a primary-button press for the move which starts the drag
  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    // Read the options as of the press
    const { disabled = false } = optionsRef.current;
    const target = event.target;

    // Ignore the press if the item is disabled, the button is not the
    // primary one, an inner draggable has taken the press, or the
    // target is editable or opted out of drags.
    if (
      disabled ||
      event.button !== 0 ||
      claimedPresses.has(event.nativeEvent) ||
      isEditableTarget(target) ||
      isInsideNoDrag(target)
    ) {
      return;
    }

    // Claim the press so the draggables around this one ignore it
    claimedPresses.add(event.nativeEvent);

    // Record the press position and whether Shift was held
    const press = {
      x: event.clientX,
      y: event.clientY,
      shiftKey: event.shiftKey,
    };

    // Start the drag once the pointer moves past the threshold
    function handleMove(moveEvent: PointerEvent): void {
      // Measure how far the pointer has moved from the press
      const distance = Math.hypot(
        moveEvent.clientX - press.x,
        moveEvent.clientY - press.y,
      );

      // Wait until the move passes the threshold
      if (distance < DRAG_THRESHOLD) {
        return;
      }

      // Stop watching the press
      release();

      // Get the element and the options as of the move
      const element = elementRef.current;
      const current = optionsRef.current;

      if (!element) {
        return;
      }

      // Notify the item that the drag is starting
      current.onActivate?.({ shiftKey: press.shiftKey });

      // Start the drag
      const drag = startDrag({
        id: current.id,
        type: current.type,
        data: resolveLazyValue(current.data),
        origin: current.origin,
        effect: current.effect,
        sourceElement: element,
        sourceRect: element.getBoundingClientRect(),
        previewElement: resolveLazyValue(current.preview) ?? element,
        clientX: moveEvent.clientX,
        clientY: moveEvent.clientY,
      });

      // Record the drag's token
      if (drag) {
        setToken(drag.token);
      }
    }

    // Stop watching the press
    function release(): void {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    }

    // Watch the press until it moves past the threshold or is released
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
  }, []);

  // Prevent the press from anchoring a text selection. The browser
  // would otherwise extend the selection into any editable text the
  // drag crosses. A press which cannot start a drag keeps its
  // default, so text entry controls still take the caret.
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    // Get the pressed element
    const target = event.target;

    // Check if the press can start a drag. If so, prevent its default.
    if (
      event.button === 0 &&
      !optionsRef.current.disabled &&
      !isEditableTarget(target) &&
      !isInsideNoDrag(target)
    ) {
      event.preventDefault();
    }
  }, []);

  // Prevent images and links inside the element from starting a native drag
  const handleDragStart = useCallback((event: React.DragEvent) => {
    // Prevent the native drag
    event.preventDefault();
  }, []);

  return {
    ref,
    isDragging,
    draggableProps: {
      ref,
      'data-draggable-key': key,
      draggable: false,
      onDragStart: handleDragStart,
      onPointerDown: handlePointerDown,
      onMouseDown: handleMouseDown,
    },
  };
}

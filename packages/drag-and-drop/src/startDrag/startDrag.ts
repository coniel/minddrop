import { Events } from '@minddrop/events';
import { resolveScrollContainers, uuid } from '@minddrop/utils';
import { DragSession } from '../DragSession';
import { DragStore } from '../DragStore';
import { updatePointerPosition } from '../PointerPositionStore';
import { cancelDrag } from '../cancelDrag';
import { endDrag } from '../endDrag';
import { DragStartedEvent } from '../events';
import { getActiveDrag } from '../getActiveDrag';
import { ActiveDrag, DragEffect, DragOrigin } from '../types';
import { updateDrag } from '../updateDrag';

export interface StartDragOptions<TData extends Record<string, unknown>> {
  /**
   * The ID of the dragged item.
   */
  id: string;

  /**
   * The type of the dragged item.
   */
  type: string;

  /**
   * The drag's data, keyed by data type.
   */
  data: TData;

  /**
   * Where the drag started from.
   */
  origin?: DragOrigin | null;

  /**
   * What a drop does with the item.
   *
   * @default 'move'
   */
  effect?: DragEffect;

  /**
   * The element the drag started from.
   */
  sourceElement: Element;

  /**
   * The bounds of the source element.
   */
  sourceRect: DOMRect;

  /**
   * The element standing in for the drag.
   */
  previewElement: Element;

  /**
   * The horizontal position of the pointer in the viewport.
   */
  clientX: number;

  /**
   * The vertical position of the pointer in the viewport.
   */
  clientY: number;
}

/**
 * Starts a drag. The drag runs until the pointer is released or the
 * drag is cancelled.
 *
 * @param options - The dragged item, its data and where it started.
 * @returns The started drag, or null when one is already in progress.
 *
 * @dispatches drag-and-drop:started
 */
export function startDrag<TData extends Record<string, unknown>>(
  options: StartDragOptions<TData>,
): ActiveDrag<TData> | null {
  // Ignore the start while a drag is already in progress
  if (getActiveDrag()) {
    return null;
  }

  // Build the drag
  const drag: ActiveDrag<TData> = {
    id: options.id,
    type: options.type,
    types: Object.keys(options.data),
    data: options.data,
    origin: options.origin ?? null,
    effect: options.effect ?? 'move',
    sourceRect: options.sourceRect,
    token: uuid(),
  };

  // Open the session and start listening for the pointer
  DragSession.current = {
    previewElement: options.previewElement,
    overKeys: [],
    scrollables: new Map(),
    visitedScrollables: resolveScrollContainers(options.sourceElement),
    autoScroll: { x: null, y: null },
    scrollFrame: null,
    removeListeners: listenForPointer(),
  };

  // Mark the document as dragging
  document.documentElement.setAttribute('data-dragging', '');

  // Record the pointer position, then activate the drag. The store's
  // subscribers read the session and the position as the drag
  // becomes active.
  updatePointerPosition(options.clientX, options.clientY);
  DragStore.getState().setActive(drag);

  // Dispatch a drag started event
  Events.dispatch(DragStartedEvent, drag);

  // Move the drag to the pointer to resolve the targets under it
  updateDrag(options.clientX, options.clientY);

  return drag;
}

/**
 * Attaches the window listeners which move and end the drag.
 *
 * @returns A function which removes the listeners.
 */
function listenForPointer(): VoidFunction {
  // Handle the pointer moving
  function handlePointerMove(event: PointerEvent): void {
    // Check if a button is still held. If not, the pointer was
    // released outside the window, so move the drag there and end it.
    if (event.buttons === 0) {
      updateDrag(event.clientX, event.clientY);
      endDrag(true);

      return;
    }

    // Move the drag
    updateDrag(event.clientX, event.clientY);
  }

  // Handle the pointer being released
  function handlePointerUp(event: PointerEvent): void {
    // Move the drag to the release point, then end it
    updateDrag(event.clientX, event.clientY);
    endDrag(true);
  }

  // Handle a key being pressed
  function handleKeyDown(event: KeyboardEvent): void {
    // Cancel the drag on Escape
    if (event.key === 'Escape') {
      cancelDrag();
    }
  }

  // Cancel the drag when a native drag of an image or link starts,
  // since the pointer events stop arriving once it takes over.
  function handleNativeDragStart(): void {
    // Cancel the drag
    cancelDrag();
  }

  // Listen for the pointer, Escape and the window losing the drag.
  // No pointer capture is taken, so the page keeps receiving pointer
  // events.
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', cancelDrag);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('blur', cancelDrag);
  window.addEventListener('dragstart', handleNativeDragStart, true);

  // Return a function which removes the listeners
  return () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', cancelDrag);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('blur', cancelDrag);
    window.removeEventListener('dragstart', handleNativeDragStart, true);
  };
}

import React, { useCallback, useId, useRef, useState } from 'react';
import { getTransferData } from '@minddrop/utils';
import { DroppablesRegistry } from '../DroppablesRegistry';
import {
  DropIndicatorPosition,
  DroppableOptions,
  DroppableOverState,
  DroppableProps,
} from '../types';
import {
  dragContainsType,
  resolveDropIndicatorPosition,
  resolveDropPosition,
} from '../utils';

export interface UseDroppableReturn {
  /**
   * Registers the element as a drop target. Also in the props,
   * exposed for composing with the element's own ref.
   */
  ref: DroppableProps['ref'];

  /**
   * Props spread onto the element which takes drops.
   */
  droppableProps: DroppableProps;

  /**
   * The position of the drop indicator, relative to the droppable
   * element.
   */
  dropIndicatorPosition: DropIndicatorPosition;

  /**
   * Whether the droppable element is currently being dragged over.
   */
  isDraggingOver: boolean;
}

// The over state of an element nothing is dragged over
const NOT_OVER: DroppableOverState = {
  isDraggingOver: false,
  dropIndicatorPosition: null,
};

/**
 * Makes an element a drop target for drags within the app and for
 * native drags from outside it.
 *
 * @param options - What the target accepts and how it takes drops.
 * @returns The props making the element a drop target and whether it is dragged over.
 */
export function useDroppable(options: DroppableOptions): UseDroppableReturn {
  // The key the element is registered under
  const key = useId();
  // The latest options
  const optionsRef = useRef(options);
  // The over state
  const [overState, setOverState] = useState<DroppableOverState>(NOT_OVER);

  // Keep the latest options in reach of the stable handlers
  optionsRef.current = options;

  // Set the over state. Skip an update which changes nothing, so it
  // does not render.
  const notify = useCallback((state: DroppableOverState) => {
    setOverState((previous) => {
      // Keep the previous state if nothing changed
      if (
        previous.isDraggingOver === state.isDraggingOver &&
        previous.dropIndicatorPosition === state.dropIndicatorPosition
      ) {
        return previous;
      }

      // Take the new state
      return state;
    });
  }, []);

  // Register the element as a drop target, unregistering it on unmount
  const ref = useCallback(
    (element: HTMLElement | null) => {
      if (!element) {
        return;
      }

      // Register the element as a drop target
      DroppablesRegistry.register({
        key,
        element,
        options: optionsRef,
        notify,
      });

      // Unregister it when the element unmounts
      return () => {
        DroppablesRegistry.unregister(key);
      };
    },
    [key, notify],
  );

  // Check whether the target accepts a native drag by its data types.
  // A native drag exposes its types but not its data until the drop.
  const acceptsNativeDrag = useCallback((event: React.DragEvent) => {
    // Read the accepted types
    const { accepts } = optionsRef.current;

    // Accept the drag when no types are required or one of them is present
    return !accepts || dragContainsType(event, accepts);
  }, []);

  // Mark the element as dragged over and resolve where a drop would land
  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      // Ignore a drag the target does not accept. The targets around
      // it get it instead.
      if (!acceptsNativeDrag(event)) {
        return;
      }

      // Read the drop options
      const { claim = true, index, isLastChild } = optionsRef.current;

      // Allow the drop
      event.preventDefault();

      // Check if the target claims the drag. If so, stop it reaching
      // the targets around.
      if (claim) {
        event.stopPropagation();
      }

      // Resolve where in the element the pointer is
      const position = resolveDropPosition(
        event.currentTarget.getBoundingClientRect(),
        event.clientX,
        event.clientY,
        optionsRef.current,
      );

      // Mark the element as dragged over, with the indicator at the
      // drop position.
      notify({
        isDraggingOver: true,
        dropIndicatorPosition: resolveDropIndicatorPosition(
          position,
          index,
          isLastChild,
        ),
      });
    },
    [acceptsNativeDrag, notify],
  );

  // Allow drops of accepted drags as they enter
  const handleDragEnter = useCallback(
    (event: React.DragEvent) => {
      // Ignore a drag the target does not accept
      if (!acceptsNativeDrag(event)) {
        return;
      }

      // Allow the drop
      event.preventDefault();
    },
    [acceptsNativeDrag],
  );

  // Clear the dragged-over state when the drag leaves the element. A
  // leave into a child of the element does not count.
  const handleDragLeave = useCallback(
    (event: React.DragEvent) => {
      // Allow the drop
      event.preventDefault();

      // Check if the drag left the element itself rather than entering
      // a child. If so, clear the state.
      if (
        event.currentTarget === event.target ||
        !event.currentTarget.contains(event.relatedTarget as Node)
      ) {
        notify(NOT_OVER);
      }
    },
    [notify],
  );

  // Take a native drop, handing its data to the drop handler
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      // Ignore a drop the target does not accept. The targets around
      // it get it instead.
      if (!acceptsNativeDrag(event)) {
        return;
      }

      // Read the drop options
      const { type, id, index, onDrop } = optionsRef.current;

      // Take the drop, keeping it from the targets around
      event.preventDefault();
      event.stopPropagation();

      // Clear the dragged-over state
      notify(NOT_OVER);

      // Hand the drop to the drop handler
      onDrop?.({
        targetType: type,
        targetId: id,
        index,
        position: resolveDropPosition(
          event.currentTarget.getBoundingClientRect(),
          event.clientX,
          event.clientY,
          optionsRef.current,
        ),
        data: getTransferData(event),
        origin: null,
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [acceptsNativeDrag, notify],
  );

  // Clear the dragged-over state as any drop within the element
  // begins. A drop taken by a nested target never reaches this
  // element's drop handler, so that handler cannot clear it.
  const handleDropCapture = useCallback(() => {
    // Clear the dragged-over state
    notify(NOT_OVER);
  }, [notify]);

  return {
    ref,
    droppableProps: {
      ref,
      'data-droppable-key': key,
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onDropCapture: handleDropCapture,
    },
    dropIndicatorPosition: overState.dropIndicatorPosition,
    isDraggingOver: overState.isDraggingOver,
  };
}

import React, { useCallback, useState } from 'react';
import { Events } from '@minddrop/events';
import { addToSelection } from '../addToSelection';
import {
  SelectionDragEndedEvent,
  SelectionDragEndedEventData,
  SelectionDragStartedEvent,
  SelectionDragStartedEventData,
} from '../events';
import { getSelection } from '../getSelection';
import { isSelected } from '../isSelected';
import { select } from '../select';
import { SelectionItem } from '../types';
import { SelectionStore } from '../useSelectionStore';
import { serializeSelectionToDataTransfer } from '../utils';

export interface DragUtils {
  /**
   * Callback to be applied to the item component as its
   * onDragStart prop. Handles selecting the item,
   * setting the drag event data as well as the dragging
   * state.
   */
  onDragStart(event: DragEvent | React.DragEvent): void;

  /**
   * Callback to be applied to the item component as its
   * onDragEnd prop. Handles reseting the dragging state.
   */
  onDragEnd(event: DragEvent | React.DragEvent): void;

  /**
   * Whether the item is currently being dragged.
   */
  isDragging: boolean;

  /**
   * Combined event handlers for the drag functionality.
   * Useful for speading the handlers onto a component.
   */
  draggableProps: {
    draggable: boolean;
    onDragStart: (event: DragEvent | React.DragEvent) => void;
    onDragEnd: (event: DragEvent | React.DragEvent) => void;
  };
}

/**
 * Returns utility functions for adding drag and
 * drop functionality to resource UI components.
 *
 * @param selectionItem - The selection item to be dragged.
 * @returns Drag utility functions.
 */
export function useDraggable(selectionItem: SelectionItem): DragUtils {
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = useCallback(
    (event: DragEvent | React.DragEvent) => {
      // Prevent parent from becoming the dragged element
      event.stopPropagation();

      if (!isSelected(selectionItem)) {
        if (event.shiftKey) {
          // If the Shift key is pressed, add the item to the
          // current selection.
          addToSelection([selectionItem]);
        } else {
          // Exclusively select the item if not already selected
          select([selectionItem]);
        }
      }

      // Ensure event has a data transfer object
      if (!event.dataTransfer) {
        return;
      }

      // Serialize the selection to the event's data transfer object
      serializeSelectionToDataTransfer(event.dataTransfer);

      // Set the dragging state to `true`
      SelectionStore.getState().setIsDragging(true);
      setIsDragging(true);

      // Dispatch a 'selection:drag:start' event
      Events.dispatch<SelectionDragStartedEventData>(
        SelectionDragStartedEvent,
        {
          event,
          selection: getSelection(),
        },
      );
    },
    [selectionItem],
  );

  const onDragEnd = useCallback((event: DragEvent | React.DragEvent) => {
    setIsDragging(false);
    // Set the dragging state to `false`
    SelectionStore.getState().setIsDragging(false);

    // Dispatch a drag ended event
    Events.dispatch<SelectionDragEndedEventData>(SelectionDragEndedEvent, {
      event,
      selection: getSelection(),
    });
  }, []);

  return {
    onDragStart,
    onDragEnd,
    isDragging,
    draggableProps: {
      draggable: true,
      onDragStart,
      onDragEnd,
    },
  };
}

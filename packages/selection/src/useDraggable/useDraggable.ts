import React, { useCallback } from 'react';
import { useCore } from '@minddrop/core';
import { SelectionItem } from '../types';
import { select } from '../select';
import { isSelected } from '../isSelected';
import { dragStart } from '../dragStart';
import { addToSelection } from '../addToSelection';
import { dragEnd } from '../dragEnd';

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
}

/**
 * Returns utility functions for adding drag and
 * drop functionality to resource UI components.
 *
 * @param selectionItem - The selection item to be dragged.
 * @returns Drag utility functions.
 */
export function useDraggable(selectionItem: SelectionItem): DragUtils {
  const core = useCore('minddrop:selection');

  const onDragStart = useCallback(
    (event: DragEvent | React.DragEvent) => {
      // Prevent parent from becoming the dragged element
      event.stopPropagation();

      if (!isSelected(selectionItem)) {
        if (event.shiftKey) {
          // If the Shift key is pressed, add the item to the
          // current selection.
          addToSelection(core, [selectionItem]);
        } else {
          // Exclusively select the item if not already selected
          select(core, [selectionItem]);
        }
      }

      // Initialize the dragging state
      dragStart(core, event, 'sort');
    },
    [core, selectionItem],
  );

  const onDragEnd = useCallback(
    (event: DragEvent | React.DragEvent) => {
      // End the drag
      dragEnd(core, event);
    },
    [core],
  );

  return {
    onDragStart,
    onDragEnd,
  };
}

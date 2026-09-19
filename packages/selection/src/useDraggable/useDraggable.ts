import { useCallback } from 'react';
import {
  DragAndDrop,
  DragEffect,
  DragOrigin,
  DragPress,
  DraggableUtils,
  UseDraggableOptions,
} from '@minddrop/drag-and-drop';
import { addToSelection } from '../addToSelection';
import { isSelected } from '../isSelected';
import { select } from '../select';
import { SelectionItem } from '../types';
import { updateSelectionItem } from '../updateSelectionItem';
import { resolveSelectionDragData } from '../utils';

export interface DraggableSelectionItemOptions {
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
  preview?: UseDraggableOptions<Record<string, unknown>>['preview'];

  /**
   * Whether the item cannot be dragged.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Called as the drag starts, before the item is selected.
   */
  onActivate?: (press: DragPress) => void;
}

/**
 * Makes an element draggable as a selection item, with the
 * serialized selection as the drag's data.
 *
 * @param selectionItem - The selection item to be dragged.
 * @param options - Where the drag starts from and how it is shown.
 * @returns The props making the element draggable and whether it is being dragged.
 */
export function useDraggable(
  selectionItem: SelectionItem,
  options: DraggableSelectionItemOptions = {},
): DraggableUtils {
  // The drag options
  const { origin, effect, preview, disabled, onActivate } = options;

  // Select the item as the drag starts. An unselected item is
  // selected exclusively, or added with Shift. An already selected
  // item is updated, since the selection may have it as it was when
  // first selected.
  const handleActivate = useCallback(
    (press: DragPress) => {
      // Notify the caller
      onActivate?.(press);

      // Check if the item is already selected. If so, update it in
      // place.
      if (isSelected(selectionItem)) {
        updateSelectionItem(selectionItem);

        return;
      }

      // Check if Shift was held. If so, add the item to the selection.
      if (press.shiftKey) {
        addToSelection([selectionItem]);

        return;
      }

      // Select the item exclusively
      select([selectionItem]);
    },
    [selectionItem, onActivate],
  );

  // Make the element draggable, serializing the selection as the
  // drag starts.
  const { draggableProps, isDragging } = DragAndDrop.useDraggable({
    id: selectionItem.id,
    type: selectionItem.type,
    data: resolveSelectionDragData,
    origin,
    effect,
    preview,
    disabled,
    onActivate: handleActivate,
  });

  return { draggableProps, isDragging };
}

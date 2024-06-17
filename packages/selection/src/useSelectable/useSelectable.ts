import { useCallback } from 'react';
import { SelectionItem } from '../types';
import { useSelection } from '../useSelection';
import { containsSelectionItem } from '../utils';
import { select } from '../select';
import { isSelected } from '../isSelected';
import { removeFromSelection } from '../removeFromSelection';
import { addToSelection } from '../addToSelection';
import { clearSelection } from '../clearSelection';

export interface SelectionUtils {
  /**
   * A boolean representing whether or not
   * the item is currently selected.
   */
  selected: boolean;

  /**
   * Callback to be applied to the item component
   * as its `onClick` prop. Handles clicking and
   * Shift clicking behaviour on the item.
   */
  onClick(event: React.MouseEvent): void;

  /**
   * Adds the item to the current selection.
   */
  addToSelection(): void;

  /**
   * Removes the item from the current selection.
   */
  removeFromSelection(): void;

  /**
   * Exclusively selects the item, clearing the
   * current selection.
   */
  select(): void;

  /**
   * Clears the current selection.
   */
  clearSelection(): void;
}

/**
 * Returns utility functions for adding selection
 * functionality to resource UI components.
 *
 * @param core - A MindDrop core instance.
 * @param item - The selection item representing the resource.
 * @returns Selection utility functions.
 */
export function useSelectable(item: SelectionItem): SelectionUtils {
  const selection = useSelection();

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      // Stop propagation to prevent document click listener
      // which clears drop selection.
      event.stopPropagation();

      if (!event.shiftKey) {
        // If not a shift click, exclusively select the item
        select([item]);
      } else if (isSelected(item)) {
        // Shift clicked an item that is already selected,
        // remove it from the selection.
        removeFromSelection([item]);
      } else {
        // Shift clicked an item that is not selected,
        // add it to the selection.
        addToSelection([item]);
      }
    },
    [item],
  );

  const addItemToSelection = useCallback(() => addToSelection([item]), [item]);

  const removeItemFromSelection = useCallback(
    () => removeFromSelection([item]),
    [item],
  );

  const selectItem = useCallback(() => select([item]), [item]);

  const clear = useCallback(() => clearSelection(), []);

  return {
    selected: containsSelectionItem(selection, item),
    onClick,
    addToSelection: addItemToSelection,
    removeFromSelection: removeItemFromSelection,
    select: selectItem,
    clearSelection: clear,
  };
}

import { afterEach, describe, expect, it } from 'vitest';
import { SelectionFixtures } from '../test-utils';
import { SelectionStore } from './SelectionStore';

const { selectionItem_A_1, selectionItem_A_2, selectionItem_B_1 } =
  SelectionFixtures;

describe('useSelectionStore', () => {
  afterEach(() => {
    SelectionStore.getState().clear();
  });

  describe('addSelectedItems', () => {
    it('adds items to the selected items list', () => {
      // Add two items to selection
      SelectionStore.getState().addSelectedItems([
        selectionItem_A_1,
        selectionItem_A_2,
      ]);

      // Add a third item to selection
      SelectionStore.getState().addSelectedItems([selectionItem_B_1]);

      // All three items should be in the selected items list
      expect(SelectionStore.getState().selectedItems).toEqual([
        selectionItem_A_1,
        selectionItem_A_2,
        selectionItem_B_1,
      ]);
    });
  });

  describe('removeSelectedItems', () => {
    it('removes items from the selected items list', () => {
      // Add two items to selection
      SelectionStore.getState().addSelectedItems([
        selectionItem_A_1,
        selectionItem_A_2,
      ]);

      // Remove an item from the selection
      SelectionStore.getState().removeSelectedItems([selectionItem_A_1]);

      // Should remove the item from the selected items list
      expect(SelectionStore.getState().selectedItems).toEqual([
        selectionItem_A_2,
      ]);
    });
  });

  describe('clearSelectedItems', () => {
    it('clears all items from the selected items list', () => {
      // Add two items to selection
      SelectionStore.getState().addSelectedItems([
        selectionItem_A_1,
        selectionItem_A_2,
      ]);

      // Clear the selected items list
      SelectionStore.getState().clearSelectedItems();

      // Selected items list should be cleared
      expect(SelectionStore.getState().selectedItems).toEqual([]);
    });
  });

  describe('updateSelectedItem', () => {
    it('replaces the selected item with the same ID', () => {
      SelectionStore.getState().addSelectedItems([
        selectionItem_A_1,
        selectionItem_A_2,
      ]);

      const updated = {
        ...selectionItem_A_1,
        data: { ...selectionItem_A_1.data, text: 'Updated' },
      };

      SelectionStore.getState().updateSelectedItem(updated);

      expect(SelectionStore.getState().selectedItems).toEqual([
        updated,
        selectionItem_A_2,
      ]);
    });

    it('leaves the selection alone when the item is not selected', () => {
      SelectionStore.getState().addSelectedItems([selectionItem_A_2]);

      SelectionStore.getState().updateSelectedItem(selectionItem_A_1);

      expect(SelectionStore.getState().selectedItems).toEqual([
        selectionItem_A_2,
      ]);
    });
  });

  describe('clear', () => {
    it('resets the state to its initial value', () => {
      // Set state values
      SelectionStore.getState().addSelectedItems([selectionItem_A_1]);

      // Clear the state
      SelectionStore.getState().clear();

      // State should contain initial values
      expect(SelectionStore.getState().selectedItems).toEqual([]);
    });
  });
});

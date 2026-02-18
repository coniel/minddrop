import { afterEach, describe, expect, it } from 'vitest';
import {
  selectionItem_A_1,
  selectionItem_A_2,
  selectionItem_B_1,
} from '../test-utils';
import { SelectionStore } from './useSelectionStore';

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

  describe('setIsDragging', () => {
    it('sets the `isDragging` value', () => {
      // Set `isDragging` to `true`
      SelectionStore.getState().setIsDragging(true);

      // `isDragging` should be `true`
      expect(SelectionStore.getState().isDragging).toBe(true);
    });
  });

  describe('clear', () => {
    it('sets the `isDragging` value', () => {
      // Set state values
      SelectionStore.getState().addSelectedItems([selectionItem_A_1]);
      SelectionStore.getState().setIsDragging(true);

      // Clear the state
      SelectionStore.getState().clear();

      // State should contain initial values
      expect(SelectionStore.getState().selectedItems).toEqual([]);
      expect(SelectionStore.getState().isDragging).toBe(false);
    });
  });
});

import { afterEach, describe, expect, it } from 'vitest';
import { selectedItem1, selectedItem2, selectedItem3 } from '../test-utils';
import { useSelectionStore } from './useSelectionStore';

describe('useSelectionStore', () => {
  afterEach(() => {
    useSelectionStore.getState().clear();
  });

  describe('addSelectedItems', () => {
    it('adds items to the selected items list', () => {
      // Add two items to selection
      useSelectionStore
        .getState()
        .addSelectedItems([selectedItem1, selectedItem2]);

      // Add a third item to selection
      useSelectionStore.getState().addSelectedItems([selectedItem3]);

      // All three items should be in the selected items list
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectedItem1,
        selectedItem2,
        selectedItem3,
      ]);
    });
  });

  describe('removeSelectedItems', () => {
    it('removes items from the selected items list', () => {
      // Add two items to selection
      useSelectionStore
        .getState()
        .addSelectedItems([selectedItem1, selectedItem2]);

      // Remove an item from the selection
      useSelectionStore.getState().removeSelectedItems([selectedItem1]);

      // Should remove the item from the selected items list
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectedItem2,
      ]);
    });
  });

  describe('clearSelectedItems', () => {
    it('clears all items from the selected items list', () => {
      // Add two items to selection
      useSelectionStore
        .getState()
        .addSelectedItems([selectedItem1, selectedItem2]);

      // Clear the selected items list
      useSelectionStore.getState().clearSelectedItems();

      // Selected items list should be cleared
      expect(useSelectionStore.getState().selectedItems).toEqual([]);
    });
  });

  describe('setIsDragging', () => {
    it('sets the `isDragging` value', () => {
      // Set `isDragging` to `true`
      useSelectionStore.getState().setIsDragging(true);

      // `isDragging` should be `true`
      expect(useSelectionStore.getState().isDragging).toBe(true);
    });
  });

  describe('clear', () => {
    it('sets the `isDragging` value', () => {
      // Set state values
      useSelectionStore.getState().addSelectedItems([selectedItem1]);
      useSelectionStore.getState().setIsDragging(true);

      // Clear the state
      useSelectionStore.getState().clear();

      // State should contain initial values
      expect(useSelectionStore.getState().selectedItems).toEqual([]);
      expect(useSelectionStore.getState().isDragging).toBe(false);
    });
  });
});

import { create } from 'zustand';
import { SelectionItem } from '../types';
import { containsSelectionItem } from '../utils';

interface SelectionStore {
  /**
   * The list of selected items.
   */
  selectedItems: SelectionItem[];

  /**
   * Adds items to the selected items list.
   */
  addSelectedItems(items: SelectionItem[]): void;

  /**
   * Removes items from the selected items list.
   */
  removeSelectedItems(items: SelectionItem[]): void;

  /**
   * Replaces the selected item with the same ID as the given item.
   * Does nothing when no such item is selected.
   */
  updateSelectedItem(item: SelectionItem): void;

  /**
   * Clears the selected items list.
   */
  clearSelectedItems(): void;

  /**
   * Clears the state, reseting it to the initial
   * value.
   */
  clear(): void;
}

export const SelectionStore = create<SelectionStore>()((set) => ({
  selectedItems: [],

  addSelectedItems: (items) =>
    set((state) => ({ selectedItems: [...state.selectedItems, ...items] })),

  removeSelectedItems: (items) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter(
        (selectedItem) => !containsSelectionItem(items, selectedItem),
      ),
    })),

  updateSelectedItem: (item) =>
    set((state) => ({
      selectedItems: state.selectedItems.map((selectedItem) =>
        selectedItem.id === item.id ? item : selectedItem,
      ),
    })),

  clearSelectedItems: () => set({ selectedItems: [] }),

  clear: () => set({ selectedItems: [] }),
}));

import createStore from 'zustand';
import { containsSelectionItem } from '../utils';
import { SelectionItem } from '../types';

interface SelectionStore {
  /**
   * The list of selected items.
   */
  selectedItems: SelectionItem[];

  /**
   * A boolean indicating whether the user is currently
   * performing a drag action.
   */
  isDragging: boolean;

  /**
   * Adds items to the selected items list.
   */
  addSelectedItems(items: SelectionItem[]): void;

  /**
   * Removes items from the selected items list.
   */
  removeSelectedItems(items: SelectionItem[]): void;

  /**
   * Clears the selected items list.
   */
  clearSelectedItems(): void;

  /**
   * Sets the `isDragging` value.
   */
  setIsDragging(value: boolean): void;

  /**
   * Clears the state, reseting it to the initial
   * value.
   */
  clear(): void;
}

export const useSelectionStore = createStore<SelectionStore>((set) => ({
  selectedItems: [],
  isDragging: false,

  addSelectedItems: (items) =>
    set((state) => ({ selectedItems: [...state.selectedItems, ...items] })),

  removeSelectedItems: (items) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter(
        (selectedItem) => !containsSelectionItem(items, selectedItem),
      ),
    })),

  clearSelectedItems: () => set({ selectedItems: [] }),

  setIsDragging: (isDragging) => set({ isDragging }),

  clear: () => set({ selectedItems: [], isDragging: false }),
}));

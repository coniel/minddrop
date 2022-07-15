import createStore from 'zustand';
import { DataInsert } from '@minddrop/core';

interface DropDataInsertsStore {
  dataInserts: Record<string, DataInsert>;
  add(dropId: string, dataInsert: DataInsert): void;
  clear(): void;
}

export const useDataInsertsStore = createStore<DropDataInsertsStore>((set) => ({
  dataInserts: {},
  add: (dropId, dataInsert) =>
    set((state) => ({
      dataInserts: { ...state.dataInserts, [dropId]: dataInsert },
    })),
  clear: () => set({ dataInserts: {} }),
}));

/**
 * Adds a data insert to the drop data inserts store.
 *
 * @param dropId - The drop ID.
 * @param dataInsert - The data insert.
 */
export function addDropDataInsert(dropId: string, dataInsert: DataInsert) {
  // Add the data insert to the store
  useDataInsertsStore.getState().add(dropId, dataInsert);
}

/**
 * Returns a drop's data insert or null if it does not exist.
 *
 * @param dropId - The drop ID.
 * @returns A data insert or null.
 */
export function getDropDataInsert(dropId: string): DataInsert | null {
  // Return the data insert or `null`
  return useDataInsertsStore.getState().dataInserts[dropId] || null;
}

/**
 * Hook which returns a drop's data insert or null if it
 * does not exist.
 *
 * @param dropId - The drop ID.
 * @returns A data insert or null.
 */
export function useDataInsert(dropId: string): DataInsert | null {
  // Return the data insert or `null`
  return useDataInsertsStore().dataInserts[dropId] || null;
}

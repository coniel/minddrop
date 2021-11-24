import { Drop, UpdateDropData } from './Drop.types';

export interface DropStore {
  /**
   * The drops, stored as a `[dropId]: Drop` map.
   */
  drops: Record<string, Drop>;

  /**
   * Bulk inserts an array of drops into the store.
   *
   * @param drops The drops to add to the store.
   */
  loadDrops(drops: Drop[]): void;

  /**
   * Clears all data from the store.
   */
  clear(): void;

  /**
   * Adds a drop to the store.
   *
   * @param drop The drop to add.
   */
  addDrop(drop: Drop): void;

  /**
   * Updates a drop in the store.
   *
   * @param id The ID of the drop to update.
   * @param data The data to set on the drop.
   */
  updateDrop(id: string, data: UpdateDropData): void;

  /**
   * Removes a drop from the store.
   *
   * @param id The ID of the drop to remove.
   */
  removeDrop(id: string): void;
}

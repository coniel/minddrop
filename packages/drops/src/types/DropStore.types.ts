import { Drop } from './Drop.types';

export interface DropStore {
  /**
   * The drops, stored as a `{ [dropId]: Drop }` map.
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
   * Sets a drop to the store.
   *
   * @param drop The drop to add.
   */
  setDrop(drop: Drop): void;

  /**
   * Removes a drop from the store.
   *
   * @param id The ID of the drop to remove.
   */
  removeDrop(id: string): void;
}

import { Drop } from './Drop.types';
import { DropConfig } from './DropConfig.types';

export interface DropStore {
  /**
   * Registered drop type configs.
   */
  registered: DropConfig[];

  /**
   * The drops, stored as a `{ [dropId]: Drop }` map.
   */
  drops: Record<string, Drop>;

  /**
   * Adds a new drop config to registered drops.
   *
   * @param config The drop config.
   */
  registerDropType(config: DropConfig): void;

  /**
   * Removes a drop config from the registered drops.
   *
   * @param type The drop type to unregister.
   */
  unregisterDropType(type: string): void;

  /**
   * Bulk inserts an array of drops into the store.
   *
   * @param drops The drops to add to the store.
   */
  loadDrops(drops: Drop[]): void;

  /**
   * Clears registered drop types from the store.
   */
  clearRegistered(): void;

  /**
   * Clears all drops from the store.
   */
  clearDrops(): void;

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

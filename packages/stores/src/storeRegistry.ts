import { StoreApi, UseBoundStore } from 'zustand';

/**
 * The type of store (determines how state is displayed in dev tools).
 */
export type RegisteredStoreType = 'array' | 'object' | 'key-value';

/**
 * A store entry in the global registry.
 */
export interface RegisteredStore {
  /**
   * The namespaced name of the store (e.g. "Databases:Entries").
   */
  name: string;

  /**
   * The type of store.
   */
  type: RegisteredStoreType;

  /**
   * The internal Zustand store.
   */
  useStore: UseBoundStore<StoreApi<unknown>>;
}

/**
 * Global registry of all stores created via createArrayStore,
 * createObjectStore, or createKeyValueStore. Keyed by store name.
 */
export const storeRegistry: Record<string, RegisteredStore> = {};

/**
 * Registers a store in the global registry.
 *
 * @param name - The namespaced name (e.g. "Databases:Entries").
 * @param type - The store type.
 * @param useStore - The internal Zustand store.
 */
export function registerStore(
  name: string,
  type: RegisteredStoreType,
  useStore: UseBoundStore<StoreApi<unknown>>,
): void {
  storeRegistry[name] = { name, type, useStore };
}

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

const registryListeners = new Set<VoidFunction>();

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

  // Notify listeners of the new store
  registryListeners.forEach((listener) => listener());
}

/**
 * Calls the callback whenever a store is registered.
 *
 * Stores are registered as the packages holding them load, which
 * can happen long after the registry is first read.
 *
 * @param callback - Called after a store is registered.
 * @returns A callback which stops listening.
 */
export function subscribeToStoreRegistry(callback: VoidFunction): VoidFunction {
  registryListeners.add(callback);

  return () => {
    registryListeners.delete(callback);
  };
}

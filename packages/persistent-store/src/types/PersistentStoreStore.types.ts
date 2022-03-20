export type ScopeStore = {
  /**
   * The document ID. In the case of a local store,
   * the ID is the application ID.
   *
   * If no document has been loaded, the ID is `null`.
   */
  id: string | null;

  /**
   * The store data, namespaced by extension ID.
   */
  data: Record<string, Record<string, any>>;
};

export type PersistentStoreScope = 'global' | 'local';

export interface PersistentStoreStore {
  /**
   * The global store.
   */
  global: ScopeStore;

  /**
   * The local store.
   */
  local: ScopeStore;

  /**
   * Loads a persistent store into the store.
   *
   * @param scope The scope into which to load the data.
   * @param store The store to load.
   */
  load(scope: PersistentStoreScope, store: ScopeStore): void;

  /**
   * Sets a value in the store.
   *
   * @param scope The scope under which the value is stored.
   * @param extensionId The namespace under which the value is stored.
   * @param key The key for which to set the value.
   * @param value The value to set.
   */
  set(
    scope: PersistentStoreScope,
    extensionId: string,
    key: string,
    value: any,
  ): void;

  /**
   * Deletes a key and assotiated data from the store.
   *
   * @param scope The scope under which the value is stored.
   * @param extensionId The namespace under which the value is stored.
   * @param key The key to delete.
   */
  delete(scope: PersistentStoreScope, extensionId: string, key: string): void;

  /**
   * Removes all data added by an extension from the store.
   *
   * @param scope The scope under which the value is stored.
   * @param extensionId The namespace under which the data is stored.
   */
  clear(scope: PersistentStoreScope, extensionId: string): void;

  /**
   * Clears all of the store data.
   *
   * @param scope The scope under which the value is stored.
   */
  clearScope(scope: 'global' | 'local'): void;
}

export type PersistentStoreChanges = Record<string, any>;

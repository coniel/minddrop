export type PersistentStoreData = Record<string, Record<string, any>>;

export type PersistentStoreScope = 'global' | 'local';

export interface PersistentStore {
  /**
   * The global store data. Namespaced by extension ID.
   */
  global: PersistentStoreData;

  /**
   * The local store data. Namedspaced by extension ID.
   */
  local: PersistentStoreData;

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
  clearChache(scope: 'global' | 'local'): void;
}

export type PersistentStoreChanges = Record<string, any>;

export type PersistentStoreData = Record<string, Record<string, any>>;

export interface PersistentStore {
  /**
   * The store data. Namespaced by extension ID.
   */
  data: PersistentStoreData;

  /**
   * Sets a value in the store.
   *
   * @param extensionId The namespace under which the value is stored.
   * @param key The key for which to set the value.
   * @param value The value to set.
   */
  set(extensionId: string, key: string, value: any): void;

  /**
   * Deletes a key and assotiated data from the store.
   *
   * @param extensionId The namespace under which the value is stored.
   * @param key The key to delete.
   */
  delete(extensionId: string, key: string): void;

  /**
   * Removes all data added by an extension from the store.
   *
   * @param extensionId The namespace under which the data is stored.
   */
  clear(extensionId: string): void;

  /**
   * Clears all of the store data.
   */
  clearAll(): void;
}

export type PersistentStoreChanges = Record<string, any>;

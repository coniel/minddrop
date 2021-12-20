import { PersistentStoreData } from './PersistentStore.types';

export interface PersistentStoreDocument {
  /**
   * The document ID. In the case of a local store,
   * the ID is the application ID.
   */
  id: string;

  /**
   * The store data.
   */
  data: PersistentStoreData;
}

import { PersistentStoreData } from './PersistentStoreStore.types';

export type PersistentStoreDocument = PersistentStoreData & {
  /**
   * The document ID. In the case of a local store,
   * the ID is the application ID.
   */
  id: string;
};

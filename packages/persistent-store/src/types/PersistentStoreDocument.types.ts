import { ScopeStore } from './PersistentStoreStore.types';

export type PersistentStoreDocument = Omit<ScopeStore, 'id'> & {
  /**
   * The document ID. In the case of a local store,
   * the ID is the application ID.
   */
  id: string;
};

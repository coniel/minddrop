import { PersistentStoreApi } from './types';
import { getStore } from './getStore';

export const PersistentStore: PersistentStoreApi = {
  getGlobalStore: (core) => getStore('global', core),
  getLocalStore: (core) => getStore('local', core),
};

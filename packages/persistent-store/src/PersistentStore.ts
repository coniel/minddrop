import { PersistentStoreApi } from './types';
import { getStore } from './getStore';
import { getStoreValue } from '.';

export const PersistentStore: PersistentStoreApi = {
  getGlobalStore: (core) => getStore('global', core),
  getLocalStore: (core) => getStore('local', core),
  getGlobalValue: (core, key, defaultValue) =>
    getStoreValue('global', core, key, defaultValue),
  getLocalValue: (core, key, defaultValue) =>
    getStoreValue('local', core, key, defaultValue),
};

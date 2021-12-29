import { PersistentStoreApi } from './types';
import { getStore } from './getStore';
import { getStoreValue } from '.';
import { setStore } from './setStore';

export const PersistentStore: PersistentStoreApi = {
  getGlobalStore: (core) => getStore('global', core),
  getLocalStore: (core) => getStore('local', core),
  getGlobalValue: (core, key, defaultValue) =>
    getStoreValue('global', core, key, defaultValue),
  getLocalValue: (core, key, defaultValue) =>
    getStoreValue('local', core, key, defaultValue),
  setGlobalStore: (core, data) => setStore('global', core, data),
  setLocalStore: (core, data) => setStore('local', core, data),
};

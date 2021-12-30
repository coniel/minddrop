import { PersistentStoreApi } from './types';
import { getStore } from './getStore';
import { getStoreValue } from './getStoreValue';
import { setStore } from './setStore';
import { setValue } from './setValue';
import { deleteValue } from './deleteValue';
import { deleteStore } from './deleteStore';
import { clearCache } from './clearCache';

export const PersistentStore: PersistentStoreApi = {
  getGlobalStore: (core) => getStore('global', core),
  getLocalStore: (core) => getStore('local', core),
  getGlobalValue: (core, key, defaultValue) =>
    getStoreValue('global', core, key, defaultValue),
  getLocalValue: (core, key, defaultValue) =>
    getStoreValue('local', core, key, defaultValue),
  setGlobalStore: (core, data) => setStore('global', core, data),
  setLocalStore: (core, data) => setStore('local', core, data),
  setGlobalValue: (core, key, value) => setValue('global', core, key, value),
  setLocalValue: (core, key, value) => setValue('local', core, key, value),
  deleteGlobalValue: (core, key) => deleteValue('global', core, key),
  deleteLocalValue: (core, key) => deleteValue('local', core, key),
  deleteGlobalStore: (core) => deleteStore('global', core),
  deleteLocalStore: (core) => deleteStore('local', core),
  clearGlobalCache: () => clearCache('global'),
  clearLocalCache: () => clearCache('local'),
  addEventListener: (core, type, data) => core.addEventListener(type, data),
  removeEventListener: (core, type, data) =>
    core.removeEventListener(type, data),
};

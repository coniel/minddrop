import { PersistentStoreApi } from './types';
import { getStore } from './getStore';
import { getStoreValue } from '.';
import { setStore } from './setStore';
import { setValue } from './setValue';

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
};

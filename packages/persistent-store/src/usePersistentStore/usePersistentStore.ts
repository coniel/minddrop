import createStore from 'zustand';
import { PersistentStoreStore } from '../types';

export const usePersistentStore = createStore<PersistentStoreStore>((set) => ({
  global: {
    id: null,
    data: {},
  },

  local: {
    id: null,
    data: {},
  },

  load: (scope, store) =>
    set(() => ({
      [scope as 'global']: store,
    })),

  set: (scope, namespace, key, value) =>
    set((state) => ({
      [scope as 'global']: {
        ...state[scope],
        data: {
          ...state[scope].data,
          [namespace]: {
            ...(state[scope].data[namespace] || {}),
            [key]: value,
          },
        },
      },
    })),

  delete: (scope, namespace, key) =>
    set((state) => {
      const data = state[scope].data[namespace] || {};

      delete data[key];

      return {
        [scope as 'global']: {
          ...state[scope],
          data: {
            ...state[scope].data,
            [namespace]: data,
          },
        },
      };
    }),

  clear: (scope, namespace) =>
    set((state) => {
      const { global, local } = state;

      if (scope === 'global') {
        delete global.data[namespace];
      } else {
        delete local.data[namespace];
      }

      return {
        global,
        local,
      };
    }),

  clearScope: (scope) =>
    set(() => ({ [scope as 'global']: { id: null, data: {} } })),
}));

import createStore from 'zustand';
import { PersistentStore } from '../types';

export const usePersistentStore = createStore<PersistentStore>((set) => ({
  data: {},

  set: (namespace, key, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [namespace]: {
          ...(state.data[namespace] || {}),
          [key]: value,
        },
      },
    })),

  delete: (namespace, key) =>
    set((state) => {
      const data = state.data[namespace] || {};

      delete data[key];

      return {
        data: {
          ...state.data,
          [namespace]: data,
        },
      };
    }),

  clear: (namespace) =>
    set((state) => {
      const { data } = state;

      delete data[namespace];

      return {
        data,
      };
    }),

  clearAll: () => set(() => ({ data: {} })),
}));

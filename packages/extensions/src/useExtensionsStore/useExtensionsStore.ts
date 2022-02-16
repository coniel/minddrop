import createStore from 'zustand';
import { ExtensionsStore } from '../types';

export const useExtensionsStore = createStore<ExtensionsStore>((set) => ({
  extensions: {},

  setExtension: (config) =>
    set((state) => ({
      extensions: { ...state.extensions, [config.id]: config },
    })),

  removeExtension: (id) =>
    set((state) => {
      const extensions = { ...state.extensions };
      delete extensions[id];

      return { extensions };
    }),

  clear: () => set(() => ({ extensions: {} })),
}));

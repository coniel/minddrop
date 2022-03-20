import createStore from 'zustand';
import { ExtensionsStore } from '../types';

export const useExtensionsStore = createStore<ExtensionsStore>((set) => ({
  extensionConfigs: {},

  extensionDocuments: {},

  setExtensionConfig: (config) =>
    set((state) => ({
      extensionConfigs: { ...state.extensionConfigs, [config.id]: config },
    })),

  removeExtensionConfig: (id) =>
    set((state) => {
      const extensionConfigs = { ...state.extensionConfigs };
      delete extensionConfigs[id];

      return { extensionConfigs };
    }),

  loadExtensionDocuments: (docs) =>
    set((state) => ({
      extensionDocuments: {
        ...state.extensionDocuments,
        ...docs.reduce((map, doc) => ({ ...map, [doc.extension]: doc }), {}),
      },
    })),

  setExtensionDocument: (doc) =>
    set((state) => ({
      extensionDocuments: { ...state.extensionDocuments, [doc.extension]: doc },
    })),

  removeExtensionDocument: (id) =>
    set((state) => {
      const extensionDocuments = { ...state.extensionDocuments };
      delete extensionDocuments[id];

      return { extensionDocuments };
    }),

  clear: () => set(() => ({ extensionConfigs: {}, extensionDocuments: {} })),
}));

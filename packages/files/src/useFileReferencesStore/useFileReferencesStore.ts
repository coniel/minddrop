import createStore from 'zustand';
import { FileReferencesStore } from '../types';

export const useFileReferencesStore = createStore<FileReferencesStore>(
  (set) => ({
    files: {},

    loadFileReferences: (files) =>
      set((state) => ({
        files: {
          ...state.files,
          ...files.reduce(
            (map, file) => ({
              ...map,
              [file.id]: file,
            }),
            {},
          ),
        },
      })),

    clear: () => set(() => ({ files: {} })),

    setFileReference: (file) =>
      set((state) => ({
        files: {
          ...state.files,
          [file.id]: file,
        },
      })),

    removeFileReference: (id) =>
      set((state) => {
        const files = { ...state.files };
        delete files[id];
        return { files };
      }),
  }),
);

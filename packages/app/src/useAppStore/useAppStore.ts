import createStore from 'zustand';
import { AppStore } from '../types';

export const useAppStore = createStore<AppStore>((set) => ({
  uiExtensions: [],

  addUiExtension: (extension) =>
    set((state) => ({ uiExtensions: [...state.uiExtensions, extension] })),

  removeUiExtension: (id) =>
    set((state) => ({
      uiExtensions: state.uiExtensions.filter(
        (extension) => extension.id !== id,
      ),
    })),

  clear: () => set({ uiExtensions: [] }),
}));

/**
 * A hook which returns UI extensions for a given location.
 *
 * @param location The location of the extensions to return.
 * @returns UI extension configs and elements.
 */
export const useUiExtensions = (location: string) =>
  useAppStore((state) =>
    state.uiExtensions.filter((extension) => extension.location === location),
  );

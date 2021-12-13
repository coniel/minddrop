import createStore from 'zustand';
import { AppStore } from '../types';

export const useAppStore = createStore<AppStore>((set) => ({
  view: { id: 'home', title: 'Home' },
  uiExtensions: [],

  setView: (view) => set({ view }),

  addUiExtension: (extension) =>
    set((state) => ({ uiExtensions: [...state.uiExtensions, extension] })),

  removeUiExtension: (location, element) =>
    set((state) => ({
      uiExtensions: state.uiExtensions.filter(
        (extension) =>
          extension.location !== location || extension.element !== element,
      ),
    })),

  removeAllUiExtensions: (source, location) =>
    set((state) => ({
      uiExtensions: state.uiExtensions.filter((extension) => {
        let keep = extension.source !== source;

        if (location && !keep) {
          keep = extension.location !== location;
        }

        return keep;
      }),
    })),

  clear: () => set({ uiExtensions: [] }),
}));

/**
 * A hook which returns the current view.
 *
 * @returns The current view.
 */
export const useView = () => useAppStore((state) => state.view);

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

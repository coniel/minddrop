import { useViewInstance, View, ViewInstance, Views } from '@minddrop/views';
import createStore from 'zustand';
import { AppStore } from '../types';

export const useAppStore = createStore<AppStore>((set) => ({
  rootTopics: [],
  archivedRootTopics: [],
  view: 'app:home',
  viewInstance: null,
  uiExtensions: [],
  selectedDrops: [],
  selectedTopics: [],
  draggedData: { drops: [], topics: [] },

  addRootTopics: (topicIds) =>
    set((state) => ({ rootTopics: [...state.rootTopics, ...topicIds] })),

  removeRootTopics: (topicIds) =>
    set((state) => ({
      rootTopics: state.rootTopics.filter(
        (topicId) => !topicIds.includes(topicId),
      ),
    })),

  addArchivedRootTopics: (topicIds) =>
    set((state) => ({
      archivedRootTopics: [...state.archivedRootTopics, ...topicIds],
    })),

  removeArchivedRootTopics: (topicIds) =>
    set((state) => ({
      archivedRootTopics: state.archivedRootTopics.filter(
        (topicId) => !topicIds.includes(topicId),
      ),
    })),

  setView: (view) => set({ view }),

  setViewInstance: (viewInstance) => set({ viewInstance }),

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

  addSelectedDrops: (dropIds) =>
    set((state) => ({
      selectedDrops: [...state.selectedDrops, ...dropIds],
    })),

  removeSelectedDrops: (dropIds) =>
    set((state) => ({
      selectedDrops: state.selectedDrops.filter(
        (dropId) => !dropIds.includes(dropId),
      ),
    })),

  clearSelectedDrops: () => set({ selectedDrops: [] }),

  addSelectedTopics: (topicIds) =>
    set((state) => ({
      selectedTopics: [...state.selectedTopics, ...topicIds],
    })),

  removeSelectedTopics: (topicIds) =>
    set((state) => ({
      selectedTopics: state.selectedTopics.filter(
        (topicId) => !topicIds.includes(topicId),
      ),
    })),

  clearSelectedTopics: () => set({ selectedTopics: [] }),

  clearSelection: () => set({ selectedDrops: [], selectedTopics: [] }),

  setDraggedData: (data) =>
    set((state) => ({ draggedData: { ...state.draggedData, ...data } })),

  clearDraggedData: () => set({ draggedData: { drops: [], topics: [] } }),

  clear: () =>
    set({
      rootTopics: [],
      archivedRootTopics: [],
      uiExtensions: [],
      selectedDrops: [],
      selectedTopics: [],
      view: 'app:home',
      viewInstance: null,
      draggedData: { drops: [], topics: [] },
    }),
}));

/**
 * A hook which returns the current view and view
 * instance (or `null` if there is no view instance).
 *
 * @returns The current view.
 */
export const useCurrentView = <I extends ViewInstance = ViewInstance>(): {
  view: View;
  instance: I | null;
} => {
  const { view: viewId, viewInstance: viewInstanceId } = useAppStore();

  const viewInstance = useViewInstance<I>(viewInstanceId || '');

  return {
    view: Views.get(viewId),
    instance: viewInstance,
  };
};

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

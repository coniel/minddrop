import {
  useViewInstance,
  ViewConfig,
  ViewInstance,
  Views,
  ViewInstanceTypeData,
} from '@minddrop/views';
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

  setRootTopics: (topicIds) => set(() => ({ rootTopics: topicIds })),

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

  clear: () =>
    set({
      rootTopics: [],
      archivedRootTopics: [],
      uiExtensions: [],
      view: 'app:home',
      viewInstance: null,
    }),
}));

/**
 * A hook which returns the current view and view
 * instance (or `null` if there is no view instance).
 *
 * @returns The current view.
 */
export const useCurrentView = <TData extends ViewInstanceTypeData = {}>(): {
  view: ViewConfig;
  instance: ViewInstance<TData> | null;
} => {
  const { view: viewId, viewInstance: viewInstanceId } = useAppStore();

  const viewInstance = useViewInstance<TData>(viewInstanceId || '');

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

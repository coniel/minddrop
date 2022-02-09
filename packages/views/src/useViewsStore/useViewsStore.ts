import createStore from 'zustand';
import { ViewsStore } from '../types';

export const useViewsStore = createStore<ViewsStore>((set) => ({
  views: {},

  instances: {},

  setView: (config) =>
    set((state) => ({ views: { ...state.views, [config.id]: config } })),

  removeView: (id) =>
    set((state) => {
      const views = { ...state.views };
      delete views[id];

      return { views };
    }),

  setInstance: (viewInstance1) =>
    set((state) => ({
      instances: {
        ...state.instances,
        [viewInstance1.id]: viewInstance1,
      },
    })),

  removeInstance: (id) =>
    set((state) => {
      const instances = { ...state.instances };
      delete instances[id];

      return { instances };
    }),

  loadInstances: (instances) =>
    set((state) => ({
      instances: {
        ...state.instances,
        ...instances.reduce(
          (map, view) => ({
            ...map,
            [view.id]: view,
          }),
          {},
        ),
      },
    })),

  clear: () => set(() => ({ views: {}, instances: {} })),
}));

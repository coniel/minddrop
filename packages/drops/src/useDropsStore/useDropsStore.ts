import createStore from 'zustand';
import { DropStore } from '../types';

export const useDropsStore = createStore<DropStore>((set) => ({
  drops: {},
  registered: [],

  registerDropType: (config) =>
    set((state) => ({
      registered: [...state.registered, config],
    })),

  unregisterDropType: (type) =>
    set((state) => ({
      registered: state.registered.filter((config) => config.type !== type),
    })),

  loadDrops: (drops) =>
    set((state) => ({
      drops: {
        ...state.drops,
        ...drops.reduce(
          (map, drop) => ({
            ...map,
            [drop.id]: drop,
          }),
          {},
        ),
      },
    })),

  clearRegistered: () => set(() => ({ registered: [] })),

  clearDrops: () => set(() => ({ drops: {} })),

  setDrop: (drop) =>
    set((state) => ({
      drops: {
        ...state.drops,
        [drop.id]: drop,
      },
    })),

  removeDrop: (id) =>
    set((state) => {
      const drops = { ...state.drops };
      delete drops[id];
      return { drops };
    }),
}));

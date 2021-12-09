import createStore from 'zustand';
import { updateStoreObject } from '@minddrop/utils';
import { DropStore } from '../types';

export const useDropsStore = createStore<DropStore>((set) => ({
  drops: {},

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

  clear: () => set(() => ({ drops: {} })),

  addDrop: (drop) =>
    set((state) => ({
      drops: {
        ...state.drops,
        [drop.id]: drop,
      },
    })),

  updateDrop: (id, data) =>
    set((state) => ({
      drops: {
        ...state.drops,
        [id]: updateStoreObject(state.drops[id], data),
      },
    })),

  removeDrop: (id) =>
    set((state) => {
      const drops = { ...state.drops };
      delete drops[id];
      return { drops };
    }),
}));

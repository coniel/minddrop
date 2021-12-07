import createStore from 'zustand';
import { updateStoreObject } from '@minddrop/utils';
import { TagsStore } from '../types';

export const useTagsStore = createStore<TagsStore>((set) => ({
  tags: {},

  loadTags: (tags) =>
    set((state) => ({
      tags: {
        ...state.tags,
        ...tags.reduce(
          (map, tag) => ({
            ...map,
            [tag.id]: tag,
          }),
          {},
        ),
      },
    })),

  clear: () => set(() => ({ tags: {} })),

  addTag: (tag) =>
    set((state) => ({
      tags: {
        ...state.tags,
        [tag.id]: tag,
      },
    })),

  updateTag: (id, data) =>
    set((state) => ({
      tags: {
        ...state.tags,
        [id]: updateStoreObject(state.tags[id], data),
      },
    })),

  removeTag: (id) =>
    set((state) => {
      const tags = { ...state.tags };
      delete tags[id];
      return { tags };
    }),
}));

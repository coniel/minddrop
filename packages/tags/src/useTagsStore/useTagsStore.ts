import createStore from 'zustand';
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

  setTag: (tag) =>
    set((state) => ({
      tags: {
        ...state.tags,
        [tag.id]: tag,
      },
    })),

  removeTag: (id) =>
    set((state) => {
      const tags = { ...state.tags };
      delete tags[id];
      return { tags };
    }),
}));

import { create } from 'zustand';
import { TopicStore } from '../types';

export const TopicsStore = create<TopicStore>()((set) => ({
  topics: [],

  load: (topics) => set((state) => ({ topics: [...state.topics, ...topics] })),

  add: (topic) =>
    set((state) => {
      return {
        topics: [...state.topics, topic],
      };
    }),

  remove: (path) =>
    set((state) => {
      return { topics: state.topics.filter((topic) => topic.path !== path) };
    }),

  update: (path, data) =>
    set((state) => {
      return {
        topics: state.topics.map((topic) => {
          if (topic.path === path) {
            return {
              ...topic,
              ...data,
            };
          }

          return topic;
        }),
      };
    }),

  clear: () => set({ topics: [] }),
}));

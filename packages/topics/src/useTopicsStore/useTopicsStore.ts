import createStore from 'zustand';
import { TopicsStore } from '../types';

export const useTopicsStore = createStore<TopicsStore>((set) => ({
  topics: {},
  views: {},

  loadTopics: (topics) =>
    set((state) => ({
      topics: {
        ...state.topics,
        ...topics.reduce(
          (map, topic) => ({
            ...map,
            [topic.id]: topic,
          }),
          {},
        ),
      },
    })),

  clear: () => set(() => ({ topics: {}, views: {} })),

  setTopic: (topic) =>
    set((state) => ({
      topics: {
        ...state.topics,
        [topic.id]: topic,
      },
    })),

  removeTopic: (id) =>
    set((state) => {
      const topics = { ...state.topics };
      delete topics[id];
      return { topics };
    }),

  setView: (view) =>
    set((state) => ({
      views: {
        ...state.views,
        [view.id]: view,
      },
    })),

  removeView: (id) =>
    set((state) => {
      const views = { ...state.views };
      delete views[id];
      return { views };
    }),
}));

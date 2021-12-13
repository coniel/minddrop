import createStore from 'zustand';
import { applyFieldValues } from '@minddrop/utils';
import { TopicsStore } from '../types';

export const useTopicsStore = createStore<TopicsStore>((set) => ({
  topics: {},

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

  clear: () => set(() => ({ topics: {} })),

  addTopic: (topic) =>
    set((state) => ({
      topics: {
        ...state.topics,
        [topic.id]: topic,
      },
    })),

  updateTopic: (id, data) =>
    set((state) => ({
      topics: {
        ...state.topics,
        [id]: applyFieldValues(state.topics[id], data),
      },
    })),

  removeTopic: (id) =>
    set((state) => {
      const topics = { ...state.topics };
      delete topics[id];
      return { topics };
    }),
}));

import createStore from 'zustand';
import { updateStoreObject } from '@minddrop/utils';
import { TopicStore } from '../types';

export const createTopicStore = () =>
  createStore<TopicStore>((set) => ({
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
          [id]: updateStoreObject(state.topics[id], data),
        },
      })),

    removeTopic: (id) =>
      set((state) => {
        const topics = { ...state.topics };
        delete topics[id];
        return { topics };
      }),
  }));

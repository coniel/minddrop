import create from 'zustand';
import { Topic } from './types';

export interface AppState {
  topics: Topic[];
  addTopic: (topic: Topic) => void;
}

export const useStore = create<AppState>((set) => ({
  topics: [],
  loadTopics: (topics: Topic[]) =>
    set((state) => ({ topics: [...state.topics, ...topics] })),
  addTopic: (topic: Topic) =>
    set((state) => ({ topics: [...state.topics, topic] })),
}));

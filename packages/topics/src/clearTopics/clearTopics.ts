import { TopicsStore } from '../TopicsStore';

/**
 * Clears all topics from the topics store.
 */
export function clearTopics(): void {
  TopicsStore.getState().clear();
}

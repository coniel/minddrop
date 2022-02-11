import { TopicViewMap } from '../types';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Returns a `{ [id]: TopicView }` map of all registered topic views.
 */
export function useTopicViews(): TopicViewMap {
  return useTopicsStore().views;
}

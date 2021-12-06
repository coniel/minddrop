import { TopicFilters, TopicMap } from '../types';
import { filterTopics } from '../filterTopics';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Returns a { [id]: Topic } map of all topics.
 * Results can be filtered by passing in TopicFilters.
 * By default, only active topics are returned.
 *
 * @param filters Filters to filter to the topics.
 * @returns The requested topic or null.
 */
export function useAllTopics(filters?: TopicFilters): TopicMap {
  const { topics } = useTopicsStore();

  if (filters) {
    return filterTopics(topics, filters);
  }

  return topics;
}

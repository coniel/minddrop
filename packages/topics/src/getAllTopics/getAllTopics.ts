import { TopicFilters, TopicMap } from '../types';
import { useTopicsStore } from '../useTopicsStore';
import { filterTopics } from '../filterTopics';

/**
 * Retrieves all topics from the topics store as a `{ [id]: Topic }` map.
 * Topics can be filtered by passing in TopicFilters.
 *
 * @param filters Filters to filter to the topics by.
 * @returns A `{ [id]: Topic }` map.
 */
export function getAllTopics(filters?: TopicFilters): TopicMap {
  const { topics } = useTopicsStore.getState();

  if (filters) {
    return filterTopics(topics, filters);
  }

  return topics;
}

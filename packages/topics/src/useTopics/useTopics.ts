import { TopicFilters, TopicMap } from '../types';
import { filterTopics } from '../filterTopics';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Returns a `{ [id]: Topic }` map of topics matching the provided IDs.
 * Results can be filtered by passing in TopicFilters.
 *
 * @param topicIds The IDs of the topics to retrieve.
 * @param filters Filters to filter to the topics.
 * @returns A `{ [id]: Topic }` map of the requested topics.
 */
export function useTopics(
  topicIds: string[],
  filters?: TopicFilters,
): TopicMap {
  const { topics } = useTopicsStore();

  let requested = topicIds.reduce(
    (map, topicId) =>
      topics[topicId] ? { ...map, [topicId]: topics[topicId] } : map,
    {},
  );

  if (filters) {
    requested = filterTopics(requested, filters);
  }

  return requested;
}

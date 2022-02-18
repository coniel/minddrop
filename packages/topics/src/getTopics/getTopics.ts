import { TopicFilters, TopicMap } from '../types';
import { useTopicsStore } from '../useTopicsStore';
import { TopicNotFoundError } from '../errors';
import { filterTopics } from '../filterTopics';

/**
 * Retrieves topics by ID from the topics store.
 * Topics can be filtered by passing in TopicFilters.
 *
 * @param ids An array of topic IDs to retrieve.
 * @param filters Filters to filter to the topics by.
 * @returns A `{ [id]: Topic }` map of the requested topics.
 */
export function getTopics(ids: string[], filters?: TopicFilters): TopicMap {
  const { topics } = useTopicsStore.getState();
  let requested = ids.reduce(
    (map, id) => (topics[id] ? { ...map, [id]: topics[id] } : map),
    {},
  );

  if (Object.keys(requested).length !== ids.length) {
    const missingIds = ids.filter((id) => !Object.keys(requested).includes(id));
    throw new TopicNotFoundError(missingIds);
  }

  if (filters) {
    requested = filterTopics(requested, filters);
  }

  return requested;
}

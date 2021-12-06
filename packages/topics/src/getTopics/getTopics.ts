import { TopicFilters, TopicMap } from '../types';
import { useTopicsStore } from '../useTopicsStore';
import { TopicNotFoundError } from '../errors';
import { filterTopics } from '../filterTopics';

/**
 * Retrieves topics by ID from the topics store.
 * Topics can be filtered by passing in TopicFilters.
 *
 * @param ids An array of topic IDs to retrieve.
 * @returns The requested topics.
 */
export function getTopics(ids: string[], filters?: TopicFilters): TopicMap {
  const { topics } = useTopicsStore.getState();
  let requested = ids.reduce(
    (map, id) => (topics[id] ? { ...map, [id]: topics[id] } : map),
    {},
  );

  if (Object.keys(requested).length !== ids.length) {
    throw new TopicNotFoundError();
  }

  if (filters) {
    requested = filterTopics(requested, filters);
  }

  return requested;
}

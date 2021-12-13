import { getTopic } from '../getTopic';
import { getTopics } from '../getTopics';
import { Topic, TopicFilters, TopicMap } from '../types';

/**
 * Retrieves one or more topics by ID.
 *
 * If provided a single ID string, returns the topic.
 *
 * If provided an array of IDs, returns a `{ [id]: Topic }` map of the corresponding topics.
 * Topics can be filtered by passing in TopicFilters. Filtering is not supported when getting a single topic.
 *
 * @param ids An array of topic IDs to retrieve.
 * @param filters Filters to filter to the topics by, only supported when getting multiple topics.
 * @returns The requested topic(s).
 */
export function get(topicId: string): Topic;
export function get(topicIds: string[], filters?: TopicFilters): TopicMap;
export function get(
  topicId: string | string[],
  filters?: TopicFilters,
): Topic | TopicMap {
  if (Array.isArray(topicId)) {
    return getTopics(topicId, filters);
  }

  if (filters) {
    throw new Error('Filtering is not supported when getting a single topic.');
  }

  return getTopic(topicId);
}

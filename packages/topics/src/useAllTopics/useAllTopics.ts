import { TopicsStore as useTopicsStore } from '../TopicsStore';
import { Topic } from '../types';

/**
 * Returns all topics.
 *
 * @returns The topics.
 */
export function useAllTopics(): Topic[] {
  // Get all topics
  const { topics } = useTopicsStore();

  return topics;
}

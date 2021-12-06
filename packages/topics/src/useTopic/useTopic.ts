import { Topic } from '../types';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Returns a topic by ID or `null` if no topic was found.
 *
 * @param topicId The ID of the topic to retrieve.
 * @returns The requested topic or null.
 */
export function useTopic(topicId: string): Topic | null {
  const { topics } = useTopicsStore();
  return topics[topicId] || null;
}

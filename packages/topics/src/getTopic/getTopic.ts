import { Topic } from '../types';
import { useTopicsStore } from '../useTopicsStore';
import { TopicNotFoundError } from '../errors';

/**
 * Retrieves a topic by ID from the topics store.
 *
 * @param id The topic ID.
 * @returns The requested topic.
 */
export function getTopic(id: string): Topic {
  const topic = useTopicsStore.getState().topics[id];

  if (!topic) {
    throw new TopicNotFoundError(id);
  }

  return topic;
}

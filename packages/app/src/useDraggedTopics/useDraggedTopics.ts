import { TopicMap, Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';

/**
 * Returns a `{ [id]: Topic }` map of the topics currently
 * being dragged.
 */
export function useDraggedTopics(): TopicMap {
  // Get dragged topic IDs
  const { topics } = useAppStore().draggedData;

  if (topics.length === 0) {
    // No topics are currently being dragged
    return {};
  }

  // Return the dragged topics
  return Topics.get(topics);
}

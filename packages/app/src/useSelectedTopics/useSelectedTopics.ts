import { TopicMap, Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';

/**
 * Returns a `{ [id]: Topic }` map of the currently
 * selected topics.
 */
export function useSelectedTopics(): TopicMap {
  // Get selected topic IDs
  const { selectedTopics } = useAppStore();

  if (selectedTopics.length === 0) {
    // No topics selected
    return {};
  }

  // Return the selected topics
  return Topics.get(selectedTopics);
}

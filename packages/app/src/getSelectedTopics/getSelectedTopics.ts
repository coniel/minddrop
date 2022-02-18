import { TopicMap, Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';

/**
 * Returns the currently selected topics.
 */
export function getSelectedTopics(): TopicMap {
  const { selectedTopics } = useAppStore.getState();

  return Topics.get(selectedTopics);
}

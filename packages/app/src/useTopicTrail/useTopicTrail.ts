import { useLocalPersistentStoreValue } from '@minddrop/persistent-store';
import { useAppCore } from '../utils';

/**
 * Returns the topic trail of the currently open
 * topic.
 *
 * @returns The trail of the current topic.
 */
export function useTopicTrail(): string[] {
  const core = useAppCore();

  // Get the current topic trail from the local
  // persistent store.
  const trail = useLocalPersistentStoreValue(core, 'topicTrail', []);

  return trail;
}

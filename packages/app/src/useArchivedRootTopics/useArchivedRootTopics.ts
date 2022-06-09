import { Topic, Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';

/**
 * Returns archived root topics in the order in which
 * they appear in the app sidebar.
 *
 * @returns Archived root topics.
 */
export function useArchivedRootTopics(): Topic[] {
  // Get the archived root topic IDs
  const { archivedRootTopics } = useAppStore();

  // Get the topics themselves
  return archivedRootTopics.map((id) => Topics.get(id));
}

import { Topic, Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';

/**
 * Returns root topics in the order they appear in
 * the sidebar.
 *
 * @returns Root topics as an ordered array.
 */
export function useRootTopics(): Topic[] {
  // Get root topic IDs
  const { rootTopics } = useAppStore();

  // Get the topics
  const topics = Topics.get(rootTopics);

  // Return the topics as an array ordered according to
  // the root topics.
  return rootTopics.map((topicId) => topics[topicId]);
}

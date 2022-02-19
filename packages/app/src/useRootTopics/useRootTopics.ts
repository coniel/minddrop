import { Core } from '@minddrop/core';
import { useGlobalPersistentStoreValue } from '@minddrop/persistent-store';
import { Topic, Topics } from '@minddrop/topics';

/**
 * Returns root topics in the order they appear in
 * the sidebar.
 *
 * @param core A MindDrop core instance.
 * @returns Root topics as an ordered array.
 */
export function useRootTopics(core: Core): Topic[] {
  // Get root topic IDs
  const rootTopics = useGlobalPersistentStoreValue(core, 'topics');

  // Get the topics
  const topics = Topics.get(rootTopics);

  // Return the topics as an array ordered according to
  // the root topics.
  return rootTopics.map((topicId) => topics[topicId]);
}

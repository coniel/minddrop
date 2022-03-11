import { Core } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
import { Topics } from '@minddrop/topics';
import { FieldValue } from '@minddrop/utils';
import { useAppStore } from '../useAppStore';

/**
 * Unarchives root level topics and dispatches an
 * `app:remove-root-topics` event.
 *
 * @param core A MindDrop core instance.
 * @param topicIds The IDs of the topics to remove from the root level.
 */
export function unarchiveRootTopics(core: Core, topicIds: string[]): void {
  // Get the topics
  const topics = Topics.get(topicIds);

  // Remove the archived topic IDs from the app store's archivedRootTopics
  useAppStore.getState().removeArchivedRootTopics(topicIds);
  // Add the topic IDs to the app store's rootTopics
  useAppStore.getState().addRootTopics(topicIds);

  // Remove the archived topic IDs to global persistent store's archivedRootTopics
  PersistentStore.setGlobalValue(
    core,
    'archivedRootTopics',
    FieldValue.arrayRemove(topicIds),
  );
  // Add the topic IDs to global persistent store's rootTopics
  PersistentStore.setGlobalValue(
    core,
    'rootTopics',
    FieldValue.arrayUnion(topicIds),
  );

  // Dispatch app:unarchive-root-topics event
  core.dispatch('app:unarchive-root-topics', topics);
}

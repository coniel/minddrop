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

  // Remove the archived topic IDs from the app store
  useAppStore.getState().removeArchivedRootTopics(topicIds);

  // Remove the archived topic IDs to global persistent store
  PersistentStore.setGlobalValue(
    core,
    'archivedRootTopics',
    FieldValue.arrayRemove(topicIds),
  );

  // Dispatch app:unarchive-root-topics event
  core.dispatch('app:unarchive-root-topics', topics);
}

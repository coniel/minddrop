import { Core } from '@minddrop/core';
import { GlobalPersistentStore } from '@minddrop/persistent-store';
import { Topics } from '@minddrop/topics';
import { FieldValue } from '@minddrop/utils';
import { useAppStore } from '../useAppStore';

/**
 * Archives root level topics and dispatches an
 * `app:archive-root-topics` event.
 *
 * @param core A MindDrop core instance.
 * @param topicIds The IDs of the root level topics to archive.
 */
export function archiveRootTopics(core: Core, topicIds: string[]): void {
  // Get the topics
  const topics = Topics.get(topicIds);

  // Add the archived topic IDs to the app store's archivedRootTopics
  useAppStore.getState().addArchivedRootTopics(topicIds);

  // Remove the archived topic IDs from the app store's rootTopics
  useAppStore.getState().removeRootTopics(topicIds);

  // Add the archived topic IDs to global persistent store's archivedRootTopics
  GlobalPersistentStore.set(
    core,
    'archivedRootTopics',
    FieldValue.arrayUnion(topicIds),
  );

  // Remove the archived topic IDs from global persistent store's rootTopics
  GlobalPersistentStore.set(
    core,
    'rootTopics',
    FieldValue.arrayRemove(topicIds),
  );

  // Dispatch app:archive-root-topics event
  core.dispatch('app:archive-root-topics', topics);
}

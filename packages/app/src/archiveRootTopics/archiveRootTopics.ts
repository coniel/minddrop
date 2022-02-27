import { Core } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
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

  // Add the archived topic IDs to the app store
  useAppStore.getState().addArchivedRootTopics(topicIds);

  // Add the archived topic IDs to global persistent store
  PersistentStore.setGlobalValue(
    core,
    'archivedRootTopics',
    FieldValue.arrayUnion(topicIds),
  );

  // Dispatch app:archive-root-topics event
  core.dispatch('app:archive-root-topics', topics);
}

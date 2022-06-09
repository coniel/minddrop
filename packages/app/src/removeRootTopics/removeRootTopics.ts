import { Core } from '@minddrop/core';
import { GlobalPersistentStore } from '@minddrop/persistent-store';
import { Topics } from '@minddrop/topics';
import { FieldValue } from '@minddrop/utils';
import { useAppStore } from '../useAppStore';

/**
 * Removes topics from the root level and dispaches an
 * `app:remove-root-topics` event.
 *
 * @param core A MindDrop core instance.
 * @param topicIds The IDs of the topics to remove from the root level.
 */
export function removeRootTopics(core: Core, topicIds: string[]): void {
  // Remove the topic IDs from the app store
  useAppStore.getState().removeRootTopics(topicIds);

  // Remove topic IDs to global persistent store
  GlobalPersistentStore.set(
    core,
    'rootTopics',
    FieldValue.arrayRemove(topicIds),
  );

  // Get the updated topics
  const topics = Topics.get(topicIds);

  // Dispatch app:root-topics:remove event
  core.dispatch('app:root-topics:remove', topics);
}

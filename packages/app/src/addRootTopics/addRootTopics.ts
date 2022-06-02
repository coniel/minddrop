import { Core } from '@minddrop/core';
import { GlobalPersistentStore } from '@minddrop/persistent-store';
import { Topics } from '@minddrop/topics';
import { FieldValue } from '@minddrop/utils';
import { useAppStore } from '../useAppStore';

/**
 * Adds topics to the root level and dispaches an
 * `app:add-root-topics` event.
 *
 * @param core A MindDrop core instance.
 * @param topicIds The IDs of the topics to add to the root level.
 */
export function addRootTopics(core: Core, topicIds: string[]): void {
  // Add the topic IDs to the app store
  useAppStore.getState().addRootTopics(topicIds);

  // Add topic IDs to global persistent store
  GlobalPersistentStore.set(
    core,
    'rootTopics',
    FieldValue.arrayUnion(topicIds),
  );

  // Get the updated topics
  const topics = Topics.get(topicIds);

  // Dispatch 'app:root-topics:add' event
  core.dispatch('app:root-topics:add', topics);
}

import { Core } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
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
  PersistentStore.setGlobalValue(
    core,
    'rootTopics',
    FieldValue.arrayUnion(topicIds),
  );

  // Dispatch app:add-root-topics event
  const topics = Topics.get(topicIds);
  core.dispatch('app:add-root-topics', topics);
}

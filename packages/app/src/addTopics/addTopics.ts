import { Core } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
import { Topics } from '@minddrop/topics';

/**
 * Adds topics to the root level and dispaches an
 * `app:add-topics` event.
 *
 * @param core A MindDrop core instance.
 * @param topicIds The IDs of the topics to be added to the root level.
 */
export function addTopics(core: Core, topicIds: string[]): void {
  // Add topic IDs to global persistent store
  PersistentStore.setGlobalValue(core, 'topics', topicIds);

  // Dispatch app:add-topics event
  const topics = Topics.get(topicIds);
  core.dispatch('app:add-topics', topics);
}

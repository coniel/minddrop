import { Core } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
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
  PersistentStore.setGlobalValue(
    core,
    'rootTopics',
    FieldValue.arrayRemove(topicIds),
  );

  // Remove app as parent on topics
  topicIds.forEach((topicId) => {
    Topics.removeParents(core, topicId, [{ type: 'app', id: 'root' }]);
  });

  // Get the updated topics
  const topics = Topics.get(topicIds);

  // Dispatch app:remove-root-topics event
  core.dispatch('app:remove-root-topics', topics);
}
import { Core } from '@minddrop/core';
import { GlobalPersistentStore } from '@minddrop/persistent-store';
import { useAppStore } from '../useAppStore';

/**
 * Adds topics to the root level and dispaches an
 * `app:root-topics:add` event.
 *
 * @param core - A MindDrop core instance.
 * @param topicIds - The IDs of the topics to add to the root level.
 * @param position - The position (index) at which to add the topics.
 */
export function addRootTopics(
  core: Core,
  topicIds: string[],
  position?: number,
): void {
  // Get the current list of root topics
  const { rootTopics } = useAppStore.getState();

  // Remove topic IDs which are already present at the
  // root level.
  const topicsToAdd = topicIds.filter(
    (topicId) => !rootTopics.includes(topicId),
  );

  // Add the new root topic IDs to the list
  rootTopics.splice(
    typeof position === 'number' ? position : rootTopics.length,
    0,
    ...topicsToAdd,
  );

  // Set the new list of root topics IDs in the app store
  useAppStore.getState().setRootTopics(rootTopics);

  // Add topic IDs to global persistent store
  GlobalPersistentStore.set(core, 'rootTopics', rootTopics);

  // Dispatch 'app:root-topics:add' event
  core.dispatch('app:root-topics:add', topicsToAdd);
}

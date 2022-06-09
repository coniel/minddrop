import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';

/**
 * Removes topics from the selected topics list and
 * dispatches a `app:selection:unselect-topics` event.
 *
 * @param core A MindTopic core instance.
 * @param topicIds The IDs of the topics to unselect.
 */
export function unselectTopics(core: Core, topicIds: string[]): void {
  // Get the topics
  const topics = Topics.get(topicIds);

  // Remove IDs from the store's selected topics
  useAppStore.getState().removeSelectedTopics(topicIds);

  // Dispatch 'app:selection:unselect-topics' event
  core.dispatch('app:selection:unselect-topics', topics);
}

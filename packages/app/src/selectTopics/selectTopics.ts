import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';

/**
 * Adds topics to the selected topics list and
 * dispatches a `app:selection:select-topics` event.
 *
 * @param core A MindTopic core instance.
 * @param topicIds The IDs of the topics to select.
 */
export function selectTopics(core: Core, topicIds: string[]): void {
  // Get the topics
  const topics = Topics.get(topicIds);

  // Add IDs to the store's selected topics
  useAppStore.getState().addSelectedTopics(topicIds);

  // Dispatch 'app:selection:select-topics' event
  core.dispatch('app:selection:select-topics', topics);
}

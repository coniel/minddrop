import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';

/**
 * Sets topics as currently being dragged and dispatches a
 * `app:drag-topics` event.
 *
 * @param core A MindTopic core instance.
 * @param topicIds The IDs of the topics being dragged.
 */
export function setDraggedTopics(core: Core, topicIds: string[]): void {
  // Set dragged topic IDs in store
  useAppStore.getState().setDraggedData({ topics: topicIds });

  // Get the dragged topics
  const topics = Topics.get(topicIds);

  // Dispatch 'app:drag-topics' event
  core.dispatch('app:drag-topics', topics);
}

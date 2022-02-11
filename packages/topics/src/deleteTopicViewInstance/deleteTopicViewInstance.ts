import { Core } from '@minddrop/core';
import { Views } from '@minddrop/views';
import { getTopicView } from '../getTopicView';
import { TopicViewInstance } from '../types';

/**
 * Deletes a topic view instance and removes it from the topic.
 * Returns the deleted view instance and dispatches a
 * `topics:delete-view-instance` event.
 *
 * @param core A MindDrop core instance.
 * @param viewInstanceId The ID of the topic view instance to delete.
 */
export function deleteTopicViewInstance(
  core: Core,
  viewInstanceId: string,
): TopicViewInstance {
  // Delete the view instance
  const instance = Views.deleteInstance<TopicViewInstance>(
    core,
    viewInstanceId,
  );

  // Get the topic view
  const topicView = getTopicView(instance.view);

  // Call topic view's onDelete callback
  if (topicView.onDelete) {
    topicView.onDelete(core, instance);
  }

  // Dispatch 'topics:delete-view-instance' event
  core.dispatch('topics:delete-view-instance', instance);

  return instance;
}

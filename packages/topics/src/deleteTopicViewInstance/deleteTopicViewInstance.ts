import { Core } from '@minddrop/core';
import { ViewInstances, ViewInstanceTypeData } from '@minddrop/views';
import { TopicViewConfigsStore } from '../TopicViewConfigsStore';
import {
  TopicViewInstance,
  TopicViewInstanceData,
  RegisteredTopicViewConfig,
} from '../types';

/**
 * Deletes a topic view instance and removes it from the topic.
 * Dispatches a `topics:view:delete` event.
 *
 * Returns the deleted topic view instance.
 *
 * @param core - A MindDrop core instance.
 * @param viewInstanceId - The ID of the topic view instance to delete.
 * @returns The deleted topic view instance.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the view instance does not exist.
 */
export function deleteTopicViewInstance<
  TTypeData extends ViewInstanceTypeData = {},
>(core: Core, viewInstanceId: string): TopicViewInstance<TTypeData> {
  // Delete the view instance
  const instance = ViewInstances.delete<TopicViewInstanceData<TTypeData>>(
    core,
    viewInstanceId,
  );

  // Get the topic view
  const topicView = TopicViewConfigsStore.get<
    RegisteredTopicViewConfig<TTypeData>
  >(instance.type);

  // Call topic view's onDelete callback
  if (topicView.onDelete) {
    topicView.onDelete(core, instance);
  }

  // Dispatch 'topics:view:delete-instance' event
  core.dispatch('topics:view:delete-instance', instance);

  return instance;
}

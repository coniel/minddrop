import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { ViewInstanceTypeData, ViewInstances } from '@minddrop/views';
import { TopicViewInstance, TopicViewInstanceData } from '../types';
import { TopicsResource } from '../TopicsResource';
import { getTopicViewConfig } from '../getTopicViewConfig';

/**
 * Creates a new instance of a topic view and adds it to the topic.
 * The topic view must first be registered using `Topics.registerView`.
 *
 * Dispatches a `topics:view:create-instance` event.
 *
 * Returns the new topic view instance.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic to which to add the view.
 * @param topicViewId - The ID of the topic view for which to create an instance.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if the view instance data is invalid.
 */
export function createTopicViewInstance<
  TData extends ViewInstanceTypeData = {},
>(core: Core, topicId: string, topicViewId: string): TopicViewInstance<TData> {
  // Get the topic
  const topic = TopicsResource.get(topicId);
  // Get the topic view
  const topicView = getTopicViewConfig(topicViewId);
  // Initialize the view instance's custom data
  const data = topicView.initializeData
    ? topicView.initializeData(core, topic)
    : {};

  // Create a new view instance
  const instance = ViewInstances.create<{}, TopicViewInstanceData<TData>>(
    core,
    topicView.id,
    {
      ...data,
      topic: topicId,
      extension: core.extensionId,
    },
  );

  // Add the new view instance to the topic
  TopicsResource.update(core, topicId, {
    views: FieldValue.arrayUnion(instance.id),
  });

  // Dispatch 'topics:view:create-instance'
  core.dispatch('topics:view:create-instance', instance);

  return instance;
}

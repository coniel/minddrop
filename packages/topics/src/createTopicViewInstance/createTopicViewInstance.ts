import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { getTopic } from '../getTopic';
import { getTopicView } from '../getTopicView';
import { TopicViewInstance, CreateTopicViewInstanceData } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Creates a new instance of a TopicView and adds it to the topic.
 * The topic view must first be registered using `Topics.registerView`
 * or else a TopicViewNotRegisteredError will be thrown.
 *
 * Returns the new view instance and dispatches a
 * `topics:create-view-instance` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to which to add the view.
 * @param topicViewId The ID of the topic view for which to create an instance.
 */
export function createTopicViewInstance<
  I extends TopicViewInstance = TopicViewInstance,
>(core: Core, topicId: string, topicViewId: string): I {
  // Get the topic
  const topic = getTopic(topicId);
  // Get the topic view
  const topicView = getTopicView(topicViewId);

  // Call topic view's onCreate
  let data = {};
  if (topicView.onCreate) {
    data = topicView.onCreate(core, topic);
  }

  // Create a new view instance
  const instance = Views.createInstance<CreateTopicViewInstanceData, I>(core, {
    ...data,
    topic: topicId,
    view: topicView.id,
  });

  // Add the new view instance to the topic
  updateTopic(core, topicId, { views: FieldValue.arrayUnion(instance.id) });

  // Dispatch 'topics:create-view-instance'
  core.dispatch('topics:create-view-instance', instance);

  return instance;
}

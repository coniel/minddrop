import { Core } from '@minddrop/core';
import { CreateTopicData, Topic, Topics } from '@minddrop/topics';
import { generateId } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { CreateTopicViewInstanceData } from '../types/TopicViewInstance';

/**
 * Creates a new topic along with a default view for it.
 * Dispatches a `topics:create` event and `views:create`
 * event. Returns the new topic.
 *
 * @param core A MindDrop core instance.
 * @param data The default topic property values.
 */
export function createTopic(core: Core, data?: CreateTopicData): Topic {
  const topicId = generateId();

  // Create the view instance
  const viewInstance = Views.createInstance<CreateTopicViewInstanceData>(core, {
    topicId,
    view: 'topics:columns-view',
  });

  // Create the topic
  const topic = Topics.create(core, {
    ...data,
    id: topicId,
    views: [viewInstance.id],
  });

  return topic;
}

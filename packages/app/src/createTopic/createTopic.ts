import { Core } from '@minddrop/core';
import { CreateTopicData, Topic, Topics } from '@minddrop/topics';
import { Views } from '@minddrop/views';

/**
 * Creates a new topic along with a default view for it.
 * Dispatches a `topics:create` event and `views:create`
 * event. Returns the new topic.
 *
 * @param core A MindDrop core instance.
 * @param data The default topic property values.
 */
export function createTopic(core: Core, data?: CreateTopicData): Topic {
  // Create the view instance
  const viewInstance = Views.createInstance(core, {
    view: 'app:topic',
  });

  // Create the topic
  const topic = Topics.create(core, { ...data, views: [viewInstance.id] });

  return topic;
}

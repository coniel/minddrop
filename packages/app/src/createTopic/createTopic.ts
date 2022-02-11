import { Core } from '@minddrop/core';
import { CreateTopicData, Topic, Topics } from '@minddrop/topics';

/**
 * Creates a new topic along with a default view for it.
 * Dispatches a `topics:create` event and `views:create`
 * event. Returns the new topic.
 *
 * @param core A MindDrop core instance.
 * @param data The default topic property values.
 */
export function createTopic(core: Core, data?: CreateTopicData): Topic {
  // Create the topic
  const topic = Topics.create(core, data);

  // Create the view instance
  const viewInstance = Topics.createViewInstance(
    core,
    topic.id,
    'topics:columns-view',
  );

  return { ...topic, views: [viewInstance.id] };
}

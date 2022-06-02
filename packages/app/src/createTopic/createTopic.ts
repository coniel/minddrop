import { Core } from '@minddrop/core';
import { CreateTopicData, Topic, Topics } from '@minddrop/topics';

/**
 * Creates a new topic along with a default view for it.
 *
 * Returns the new topic.
 *
 * @param core - A MindDrop core instance.
 * @param data - The default topic property values.
 * @returns The new topic.
 */
export function createTopic(core: Core, data?: CreateTopicData): Topic {
  // Create the topic
  const topic = Topics.create(core, data);

  // Create the view instance
  const viewInstance = Topics.createViewInstance(
    core,
    topic.id,
    'minddrop:topic-view:columns',
  );

  return { ...topic, views: [viewInstance.id] };
}

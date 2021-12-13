import { Core } from '@minddrop/core';
import { generateTopic } from '../generateTopic';
import { CreateTopicData, Topic } from '../types';

/**
 * Creates a new topic and dispatches a `topics:create` event.
 * Returns the new topic.
 *
 * @param core A MindDrop core instance.
 * @param data The default topic property values.
 * @returns The newly created topic.
 */
export function createTopic(core: Core, data?: CreateTopicData): Topic {
  const topic = generateTopic(data);

  core.dispatch('topics:create', topic);

  return topic;
}

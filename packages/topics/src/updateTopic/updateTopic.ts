import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { getTopic } from '../getTopic';
import { Topic, TopicChanges } from '../types';

/**
 * Updates a topic and dispatches a `topics:update` event.
 *  Returns the updated topic.
 *
 * @param core A MindDrop core instance.
 * @param id The ID of the topic to update.
 * @param data The changes to apply to the topic.
 * @returns The updated topic.
 */
export function updateTopic(
  core: Core,
  id: string,
  data: Omit<TopicChanges, 'updatedAt'>,
): Topic {
  const topic = getTopic(id);
  const update = createUpdate(topic, data, { setUpdatedAt: true });

  core.dispatch('topics:update', update);

  return update.after;
}

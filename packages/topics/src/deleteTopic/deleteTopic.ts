import { Core } from '@minddrop/core';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Deletes a topic and dispatches a `topics:delete`
 * event and an `topics:update` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to delete.
 * @returns The deleted topic.
 */
export function deleteTopic(core: Core, topicId: string): Topic {
  // Update the topic
  const updated = updateTopic(core, topicId, {
    deleted: true,
    deletedAt: new Date(),
  });

  // Dispatch 'topics:delete' event
  core.dispatch('topics:delete', updated);

  return updated;
}

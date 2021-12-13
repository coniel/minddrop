import { Core } from '@minddrop/core';
import { getTopic } from '../getTopic';

/**
 * Permanently deletes a topic and dispatches a
 * `topics:delete-permanently` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to delete permanently.
 */
export function deleteTopicPermanently(core: Core, topicId: string): void {
  const topic = getTopic(topicId);

  // Dispatch 'topics:delete-permanently' event
  core.dispatch('topics:delete-permanently', topic);
}

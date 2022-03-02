import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { getTopic } from '../getTopic';
import { Topic } from '../types';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Permanently deletes a topic and dispatches a
 * `topics:delete-permanently` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to delete permanently.
 * @retuns The deleted topic.
 */
export function deleteTopicPermanently(core: Core, topicId: string): Topic {
  const topic = getTopic(topicId);

  // Remove the topic from the store
  useTopicsStore.getState().removeTopic(topicId);

  // Remove the topic as a parent from its drops
  topic.drops.forEach((dropId) => {
    Drops.removeParents(core, dropId, [{ type: 'topic', id: topicId }]);
  });

  // Dispatch 'topics:delete-permanently' event
  core.dispatch('topics:delete-permanently', topic);

  return topic;
}

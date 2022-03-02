import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { Views } from '@minddrop/views';
import { getTopic } from '../getTopic';
import { removeParentsFromTopic } from '../removeParentsFromTopic';
import { Topic } from '../types';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Permanently deletes a topic and its associated view instance
 * and removes the topic as a parent from its drops and subtopics.
 * Dispatches a `topics:delete-permanently` event.
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

  // Remove the topic as a parent from its subtopics
  topic.subtopics.forEach((subtopicId) => {
    removeParentsFromTopic(core, subtopicId, [{ type: 'topic', id: topicId }]);
  });

  // Delete all of the topic's view instances
  topic.views.forEach((viewInstanceId) => {
    Views.deleteInstance(core, viewInstanceId);
  });

  // Dispatch 'topics:delete-permanently' event
  core.dispatch('topics:delete-permanently', topic);

  return topic;
}

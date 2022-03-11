import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { removeRootTopics } from '../removeRootTopics';

/**
 * Removes topics from the root level and adds them as
 * subtopics into a specified topic.
 * Dispatches a `app:move-root-topics` event.
 *
 * @param core A MindDrop core instance.
 * @param toTopicId The ID of the topic into which to move the topics.
 * @param topicIds The IDs of the root level topics to move.
 */
export function moveRootTopicsToParentTopic(
  core: Core,
  toTopicId: string,
  topicIds: string[],
): void {
  // Remove the topics from the root level
  removeRootTopics(core, topicIds);

  // Add the topics to the target parent topic
  const toTopic = Topics.addSubtopics(core, toTopicId, topicIds);

  // Get the updated topics
  const topics = Topics.get(topicIds);

  // Dispatch a `app:move-root-topics` event
  core.dispatch('app:move-root-topics', { toTopic, topics });
}

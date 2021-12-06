import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { getTopics } from '../getTopics';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Adds subtopics into a parent topic.
 * Dispatches an `topics:add-subtopics` event, as well
 * as a `topics:update` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to which to add the subtopics.
 * @param subtopicIds The IDs of the subtopics to add to the topic.
 * @returns The updated topic.
 */
export function addSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Check that all subtopics exist
  getTopics(subtopicIds);

  // Update the topic
  const updated = updateTopic(core, topicId, {
    subtopics: FieldValue.arrayUnion(...subtopicIds),
  });

  core.dispatch('topics:add-subtopics', {
    topic: updated,
    subtopics: subtopicIds,
  });

  return updated;
}

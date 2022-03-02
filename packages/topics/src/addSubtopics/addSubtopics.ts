import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { addParentsToTopic } from '../addParentsToTopic';
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
  // Get the subtopics
  const subtopics = getTopics(subtopicIds);

  // Update the topic
  const updated = updateTopic(core, topicId, {
    subtopics: FieldValue.arrayUnion(subtopicIds),
  });

  // Add the topic as a parent on the subtopics
  subtopicIds.forEach((subtopicId) => {
    // Add the topic as a parent
    const subtopic = addParentsToTopic(core, subtopicId, [
      { type: 'topic', id: topicId },
    ]);

    // Update the subtopic in the subtopic map
    subtopics[subtopicId] = subtopic;
  });

  // Dispatch 'topics:add-subtopics' event
  core.dispatch('topics:add-subtopics', {
    topic: updated,
    subtopics,
  });

  return updated;
}

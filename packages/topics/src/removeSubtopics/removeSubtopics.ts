import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { getTopics } from '../getTopics';
import { removeParentsFromTopic } from '../removeParentsFromTopic';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Removes subtopics from a parent topic and
 * dispatches a `topics:remove-subtopics` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic from which to remove the subtopics.
 * @param subtopicIds The IDs of the subtopics to remove from the topic.
 * @returns The updated topic.
 */
export function removeSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Get the subtopics
  const subtopics = getTopics(subtopicIds);

  // Update the topic in the store
  const updated = updateTopic(core, topicId, {
    subtopics: FieldValue.arrayRemove(subtopicIds),
  });

  // Remove the topic as a parent on the subtopics
  subtopicIds.forEach((subtopicId) => {
    // Remove the topic as a parent
    const subtopic = removeParentsFromTopic(core, subtopicId, [
      { type: 'topic', id: topicId },
    ]);

    // Update the subtopic in the subtopics map
    subtopics[subtopicId] = subtopic;
  });

  // Dispatch 'topics:remove-subtopics'
  core.dispatch('topics:remove-subtopics', {
    topic: updated,
    subtopics,
  });

  return updated;
}

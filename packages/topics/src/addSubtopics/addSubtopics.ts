import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { TopicsResource } from '../TopicsResource';

/**
 * Adds subtopics into a parent topic.
 * Dispatches an `topics:topic:add-subtopics` event
 *
 * Returns the updated topic.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic to which to add the subtopics.
 * @param subtopicIds - The IDs of the subtopics to add to the topic.
 * @returns The updated topic.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if any of the subtopics do not exist.
 */
export function addSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Get the topic
  const topic = TopicsResource.get(topicId);

  // Filter out subtopic IDs already in the topic to prevent duplicates
  const newSubtopicIds = subtopicIds.filter(
    (id) => !topic.subtopics.includes(id),
  );

  // Update the topic
  const updated = TopicsResource.update(core, topicId, {
    subtopics: FieldValue.arrayUnion(newSubtopicIds),
  });

  // Get the updated subtopics
  const subtopics = TopicsResource.get(newSubtopicIds);

  // Dispatch 'topics:topic:add-subtopics' event
  core.dispatch('topics:topic:add-subtopics', {
    topic: updated,
    subtopics,
  });

  return updated;
}

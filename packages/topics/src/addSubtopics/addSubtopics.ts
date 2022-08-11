import { Core } from '@minddrop/core';
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
 * @param position - The index at which to add the subtopics.
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
  position?: number,
): Topic {
  // Get the topic
  const topic = TopicsResource.get(topicId);

  // Filter out subtopic IDs already in the topic to prevent duplicates
  const newSubtopicIds = subtopicIds.filter(
    (id) => !topic.subtopics.includes(id),
  );

  // Add the new subtopics to the specified positon
  const sorted = [...topic.subtopics];
  sorted.splice(
    typeof position === 'number' ? position : topic.subtopics.length,
    0,
    ...newSubtopicIds,
  );

  // Update the topic
  const updated = TopicsResource.update(core, topicId, {
    subtopics: sorted,
  });

  // Get the new subtopics
  const subtopics = TopicsResource.get(newSubtopicIds);

  // Dispatch 'topics:topic:add-subtopics' event
  core.dispatch('topics:topic:add-subtopics', {
    topic: updated,
    subtopics,
  });

  return updated;
}

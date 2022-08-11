import { Core } from '@minddrop/core';
import { addSubtopics } from '../addSubtopics';
import { removeSubtopics } from '../removeSubtopics';
import { TopicsResource } from '../TopicsResource';

/**
 * Moves subtopics from one topic to another.
 * Dispatches a `topics:topic:move-subtopics` event.
 *
 * @param core - A MindDrop core instance.
 * @param fromTopicId - The ID of the topic from which to move the subtopics.
 * @param toTopicId - The ID of the topic into which to move the subtopics.
 * @param subtopicIds - The IDs of the subtopics to remove.
 * @param position - The index at which to add the subtopics.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if any of the subtopics do not exist.
 */
export function moveSubtopics(
  core: Core,
  fromTopicId: string,
  toTopicId: string,
  subtopicIds: string[],
  position?: number,
): void {
  // Remove subtopics from parent topic
  const fromTopic = removeSubtopics(core, fromTopicId, subtopicIds);
  // Adds subtopics to new parent topic
  const toTopic = addSubtopics(core, toTopicId, subtopicIds, position);

  // Get updated subtopics
  const subtopics = TopicsResource.get(subtopicIds);

  // Dispatch a 'topics:topic:move-subtopics' event
  core.dispatch('topics:topic:move-subtopics', {
    fromTopic,
    toTopic,
    subtopics,
  });
}

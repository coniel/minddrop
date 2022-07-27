import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { TopicsResource } from '../TopicsResource';

/**
 * Removes subtopics from a parent topic.
 * Dispatches a `topics:topic:remove-subtopics` event.
 *
 * Returns the updated topic.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic from which to remove the subtopics.
 * @param subtopicIds - The IDs of the subtopics to remove from the topic.
 * @returns The updated topic.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 */
export function removeSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Get the subtopics
  const subtopics = TopicsResource.get(subtopicIds);

  // Update the topic in the store
  const updated = TopicsResource.update(core, topicId, {
    subtopics: FieldValue.arrayRemove(subtopicIds),
  });

  // Remove the topic as a parent on the subtopics
  subtopicIds.forEach((subtopicId) => {
    // Remove the topic as a parent
    const subtopic = TopicsResource.removeParents(core, subtopicId, [
      { resource: 'topics:topic', id: topicId },
    ]);

    // Update the subtopic in the subtopics map
    subtopics[subtopicId] = subtopic;
  });

  // Dispatch 'topics:topic:remove-subtopics'
  core.dispatch('topics:topic:remove-subtopics', {
    topic: updated,
    subtopics,
  });

  return updated;
}

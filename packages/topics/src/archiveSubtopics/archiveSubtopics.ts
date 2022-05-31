import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { TopicsResource } from '../TopicsResource';

/**
 * Archives the specified subtopics in a topic.
 * Dispatches a `topics:topic:archive-subtopics` event.
 *
 * Returns the updated topic.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic on which to archive the subtopics.
 * @param subtopicIds - The IDs of the subtopics to archive.
 * @returns The updated topic.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if any of the subtopics do not exist.
 */
export function archiveSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Update the topic
  const topic = TopicsResource.update(core, topicId, {
    // Remove subtopic IDs from 'subtopics'
    subtopics: FieldValue.arrayRemove(subtopicIds),
    // Add subtopic IDs to 'archivedSubtopics'
    archivedSubtopics: FieldValue.arrayUnion(subtopicIds),
  });

  // Get the updated subtopics
  const subtopics = TopicsResource.get(subtopicIds);

  // Dispatch 'topics:topic:archive-subtopics' event
  core.dispatch('topics:topic:archive-subtopics', { topic, subtopics });

  // Return the updated topic
  return topic;
}

import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { TopicsResource } from '../TopicsResource';

/**
 * Unarchives the specified subtopics in a topic.
 * Dispatches a `topics:unarchive-subtopics` event.
 *
 * Returns the updated topic.
 *
 * @param core A MindSubtopic core instance.
 * @param topicId The ID of the topic on which to unarchive the subtopics.
 * @param subtopicIds The IDs of the subtopics to unarchive.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if any of the subtopics do not exist.
 * @returns The updated topic.
 */
export function unarchiveSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Update the topic
  const topic = TopicsResource.update(core, topicId, {
    // Remove subtopic IDs from 'unarchivedSubtopics'
    archivedSubtopics: FieldValue.arrayRemove(subtopicIds),
    // Add subtopic IDs to 'subtopics'
    subtopics: FieldValue.arrayUnion(subtopicIds),
  });

  // Get the updated subtopics
  const subtopics = TopicsResource.get(subtopicIds);

  // Dispatch 'topics:topic:unarchive-subtopics' event
  core.dispatch('topics:topic:unarchive-subtopics', { topic, subtopics });

  // Return the updated topic
  return topic;
}

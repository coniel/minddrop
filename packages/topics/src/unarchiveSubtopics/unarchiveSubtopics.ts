import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { getTopics } from '../getTopics';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Unarchives the specified subtopics in a topic and dispatches
 * a `topics:unarchive-subtopics` event.
 * Returns the updated topic.
 *
 * @param core A MindSubtopic core instance.
 * @param topicId The ID of the topic on which to unarchive the subtopics.
 * @param subtopicIds The IDs of the subtopics to unarchive.
 * @returns The updated topic.
 */
export function unarchiveSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Get the subtopics
  const subtopics = getTopics(subtopicIds);

  // Update the topic
  const topic = updateTopic(core, topicId, {
    // Remove subtopic IDs from 'unarchivedSubtopics'
    archivedSubtopics: FieldValue.arrayRemove(subtopicIds),
    // Add subtopic IDs to 'subtopics'
    subtopics: FieldValue.arrayUnion(subtopicIds),
  });

  // Dispatch 'topics:unarchive-subtopics' event
  core.dispatch('topics:unarchive-subtopics', { topic, subtopics });

  // Return the updated topic
  return topic;
}

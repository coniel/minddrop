import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { getTopics } from '../getTopics';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Archives the specified subtopics in a topic and dispatches
 * a `topics:archive-subtopics` event.
 * Returns the updated topic.
 *
 * @param core A MindSubtopic core instance.
 * @param topicId The ID of the topic on which to archive the subtopics.
 * @param subtopicIds The IDs of the subtopics to archive.
 * @returns The updated topic.
 */
export function archiveSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Get the subtopics
  const subtopics = getTopics(subtopicIds);

  // Update the topic
  const topic = updateTopic(core, topicId, {
    // Remove subtopic IDs from 'subtopics'
    subtopics: FieldValue.arrayRemove(subtopicIds),
    // Add subtopic IDs to 'archivedSubtopics'
    archivedSubtopics: FieldValue.arrayUnion(subtopicIds),
  });

  // Dispatch 'topics:archive-subtopics' event
  core.dispatch('topics:archive-subtopics', { topic, subtopics });

  // Return the updated topic
  return topic;
}

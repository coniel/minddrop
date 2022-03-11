import { Core } from '@minddrop/core';
import { addSubtopics } from '../addSubtopics';
import { getTopics } from '../getTopics';
import { removeSubtopics } from '../removeSubtopics';

/**
 * Moves subtopics from one topic to another and dispaches
 * a `topics:move-subtopics` event.
 *
 * @param core A MindDrop core instance.
 * @param fromTopicId The ID of the topic from which to move the subtopics.
 * @param toTopicId The ID of the topic into which to move the subtopics.
 * @param subtopicIds The IDs of the subtopics to remove.
 */
export function moveSubtopics(
  core: Core,
  fromTopicId: string,
  toTopicId: string,
  subtopicIds: string[],
): void {
  // Remove subtopics from parent topic
  const fromTopic = removeSubtopics(core, fromTopicId, subtopicIds);
  // Adds subtopics to new parent topic
  const toTopic = addSubtopics(core, toTopicId, subtopicIds);

  // Get updated subtopics
  const subtopics = getTopics(subtopicIds);

  // Dispatch a 'topics:move-subtopics' event
  core.dispatch('topics:move-subtopics', { fromTopic, toTopic, subtopics });
}

import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { addRootTopics } from '../addRootTopics';

/**
 * Removes subtopics from a parent topic and adds them to the
 * root level.
 *
 * @param core - A MindDrop core instance.
 * @param parentTopicId - The ID of the parent topic containg the subtopics.
 * @param subtopicIds - The IDs of the subtopics to move to the root level.
 */
export function moveSubtopicsToRoot(
  core: Core,
  parentTopicId: string,
  subtopicIds: string[],
): void {
  // Remove subtopics from parent topic
  Topics.removeSubtopics(core, parentTopicId, subtopicIds);

  // Add subtopics to the root level
  addRootTopics(core, subtopicIds);
}

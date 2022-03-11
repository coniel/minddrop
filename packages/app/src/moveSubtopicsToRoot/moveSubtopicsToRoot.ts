import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { addRootTopics } from '../addRootTopics';

/**
 * Removes subtopics from a parent topic and adds them to the
 * root level. Dispatches a `app:move-subtopics-root` event.
 *
 * @param core A MindDrop core instance.
 * @param parentTopicId The ID of the parent topic containg the subtopics.
 * @param subtopicIds The IDs of the subtopics to move to the root level.
 */
export function moveSubtopicsToRoot(
  core: Core,
  parentTopicId: string,
  subtopicIds: string[],
): void {
  // Remove subtopics from parent topic
  const fromTopic = Topics.removeSubtopics(core, parentTopicId, subtopicIds);

  // Add subtopics to the root level
  addRootTopics(core, subtopicIds);

  // Get the updated subtopics
  const subtopics = Topics.get(subtopicIds);

  // Dispatch an 'app:move-subtopics-root' event
  core.dispatch('app:move-subtopics-root', { fromTopic, subtopics });
}

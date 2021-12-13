import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Removes subtopics from a parent topic.
 * Dispatches an `topics:remove-subtopics` event, as well
 * as a `topics:update` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic from which to remove the subtopics.
 * @param subtopicIds The IDs of the subtopics to remove from the topic.
 * @returns The updated topic.
 */
export function removeSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Update the topic
  const updated = updateTopic(core, topicId, {
    subtopics: FieldValue.arrayRemove(subtopicIds),
  });

  core.dispatch('topics:remove-subtopics', {
    topic: updated,
    subtopics: subtopicIds,
  });

  return updated;
}

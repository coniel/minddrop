import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { TopicsResource } from '../TopicsResource';

/**
 * Unarchives the specified drops in a topic.
 * Dispatches a `topics:topic:unarchive-drops` event.
 *
 * Returns the updated topic.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic on which to unarchive the drops.
 * @param dropIds - The IDs of the drops to unarchive.
 * @returns The updated topic.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if any of the drops do not exist.
 */
export function unarchiveDropsInTopic(
  core: Core,
  topicId: string,
  dropIds: string[],
): Topic {
  // Update the topic
  const topic = TopicsResource.update(core, topicId, {
    // Remove drop IDs from 'unarchivedDrops'
    archivedDrops: FieldValue.arrayRemove(dropIds),
    // Add drop IDs to 'drops'
    drops: FieldValue.arrayUnion(dropIds),
  });

  // Get the updated drops
  const drops = Drops.get(dropIds);

  // Dispatch 'topics:topic:unarchive-drops' event
  core.dispatch('topics:topic:unarchive-drops', { topic, drops });

  // Return the updated topic
  return topic;
}

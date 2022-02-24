import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Unarchives the specified drops in a topic and dispatches
 * a `topics:unarchive-drops` event.
 * Returns the updated topic.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic on which to unarchive the drops.
 * @param dropIds The IDs of the drops to unarchive.
 * @returns The updated topic.
 */
export function unarchiveDropsInTopic(
  core: Core,
  topicId: string,
  dropIds: string[],
): Topic {
  // Get the drops
  const drops = Drops.get(dropIds);

  // Update the topic
  const topic = updateTopic(core, topicId, {
    // Remove drop IDs from 'unarchivedDrops'
    archivedDrops: FieldValue.arrayRemove(dropIds),
    // Add drop IDs to 'drops'
    drops: FieldValue.arrayUnion(dropIds),
  });

  // Dispatch 'topics:unarchive-drops' event
  core.dispatch('topics:unarchive-drops', { topic, drops });

  // Return the updated topic
  return topic;
}

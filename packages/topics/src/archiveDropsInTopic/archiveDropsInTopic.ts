import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Archives the specified drops in a topic and dispatches
 * a `topics:archive-drops` event.
 * Returns the updated topic.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic on which to archive the drops.
 * @param dropIds The IDs of the drops to archive.
 * @returns The updated topic.
 */
export function archiveDropsInTopic(
  core: Core,
  topicId: string,
  dropIds: string[],
): Topic {
  // Get the drops
  const drops = Drops.get(dropIds);

  // Update the topic
  const topic = updateTopic(core, topicId, {
    // Remove drop IDs from 'drops'
    drops: FieldValue.arrayRemove(dropIds),
    // Add drop IDs to 'archivedDrops'
    archivedDrops: FieldValue.arrayUnion(dropIds),
  });

  // Dispatch 'topics:archive-drops' event
  core.dispatch('topics:archive-drops', { topic, drops });

  // Return the updated topic
  return topic;
}

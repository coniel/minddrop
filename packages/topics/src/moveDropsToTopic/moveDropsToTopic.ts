import { Core } from '@minddrop/core';
import { AddDropsMetadata } from '../types';
import { addDropsToTopic } from '../addDropsToTopic';
import { removeDropsFromTopic } from '../removeDropsFromTopic';
import { Drops } from '@minddrop/drops';

/**
 * Moves drops from one topic to another by removing them
 * from the source topic and adding them to the target topic.
 *
 * @param core - A MindDrop core instance.
 * @param fromTopicId - The ID of the topic from which to move the drops.
 * @param toTopicId - The ID of the topic to which to move the drops.
 * @param dropIds - The IDs of the drops to move.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if any of the drops do not exist.
 */
export function moveDropsToTopic(
  core: Core,
  fromTopicId: string,
  toTopicId: string,
  dropIds: string[],
  metadata?: AddDropsMetadata,
): void {
  // Add drops to target topic
  const toTopic = addDropsToTopic(core, toTopicId, dropIds, metadata);

  // Remove drops from source topic
  const fromTopic = removeDropsFromTopic(core, fromTopicId, dropIds);

  // Get the updated drops
  const drops = Drops.get(dropIds);

  // Dispatch a `topics:topic:move-drops` event
  core.dispatch('topics:topic:move-drops', { fromTopic, toTopic, drops });
}

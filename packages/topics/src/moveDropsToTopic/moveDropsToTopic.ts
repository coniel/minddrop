import { Core } from '@minddrop/core';
import { AddDropsMetadata } from '../types';
import { addDropsToTopic } from '../addDropsToTopic';
import { removeDropsFromTopic } from '../removeDropsFromTopic';

/**
 * Moves drops from one topic to another by removing them
 * from the source topic and adding them to the target topic.
 *
 * @param core A MindDrop core instance.
 * @param fromTopicId The ID of the topic from which to move the drops.
 * @param toTopicId The ID of the topic to which to move the drops.
 * @param dropIds The IDs of the drops to move.
 */
export function moveDropsToTopic(
  core: Core,
  fromTopicId: string,
  toTopicId: string,
  dropIds: string[],
  metadata?: AddDropsMetadata,
): void {
  // Add drops to target topic
  addDropsToTopic(core, toTopicId, dropIds, metadata);

  // Remove drops from source topic
  removeDropsFromTopic(core, fromTopicId, dropIds);
}

import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Drops } from '@minddrop/drops';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Removes drops from a topic and dispatches a `topics:remove-drops` event
 * and a `topics:update` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic from which to remove the drops.
 * @param dropIds The IDs of the drops to remove.
 * @returns The updated topic.
 */
export function removeDropsFromTopic(
  core: Core,
  topicId: string,
  dropIds: string[],
): Topic {
  const drops = Drops.get(dropIds);
  const topic = updateTopic(core, topicId, {
    drops: FieldValue.arrayRemove(dropIds),
  });

  core.dispatch('topics:remove-drops', { topic, drops });

  return topic;
}

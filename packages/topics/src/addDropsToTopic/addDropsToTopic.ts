import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Adds drops to a topic and dispatches a `topics:add-drops` event
 * and a `topics:update` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to which to add the drops.
 * @param dropIds The IDs of the drops to add to the topic.
 * @returns The updated topic.
 */
export function addDropsToTopic(
  core: Core,
  topicId: string,
  dropIds: string[],
): Topic {
  // Check that drops exist
  const drops = Drops.get(dropIds);

  const topic = updateTopic(core, topicId, {
    drops: FieldValue.arrayUnion(dropIds),
  });

  core.dispatch('topics:add-drops', {
    topic,
    drops,
  });

  return topic;
}

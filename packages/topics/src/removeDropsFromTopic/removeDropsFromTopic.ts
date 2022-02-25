import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Drops } from '@minddrop/drops';
import { Topic, TopicViewInstance } from '../types';
import { updateTopic } from '../updateTopic';
import { Views } from '@minddrop/views';
import { getTopicView } from '../getTopicView';

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
  // Get the drops
  const drops = Drops.get(dropIds);

  // Update the topic
  const topic = updateTopic(core, topicId, {
    drops: FieldValue.arrayRemove(dropIds),
  });

  // Remove topic as parent from drops
  Object.values(drops).forEach((drop) => {
    // Don't remove topic as parent from deleted drops so that they
    // can be restored to the topic.
    if (!drop.deleted) {
      // Remove the parent
      const updatedDrop = Drops.removeParents(core, drop.id, [topicId]);
      // Update drop in DropMap
      drops[drop.id] = updatedDrop;
    }
  });

  // Get the topic's view instances
  const viewInstances = Views.getInstances<TopicViewInstance>(topic.views);

  // Call onRemoveDrops on each of the topic's view instances
  Object.values(viewInstances).forEach((viewInstance) => {
    const view = getTopicView(viewInstance.view);

    if (view.onRemoveDrops) {
      view.onRemoveDrops(core, viewInstance, drops);
    }
  });

  // Dispatch 'topics:remove-drops' event
  core.dispatch('topics:remove-drops', { topic, drops });

  return topic;
}

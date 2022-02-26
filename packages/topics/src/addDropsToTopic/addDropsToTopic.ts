import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { getTopicView } from '../getTopicView';
import { Topic, TopicViewInstance } from '../types';
import { updateTopic } from '../updateTopic';

export interface AddDropMetadata {
  /**
   * The ID of the view instance into which the drop was inserted.
   * `null` if the drop was not inserted into a view.
   */
  viewInstance: string | null;
}

/**
 * Adds drops to a topic and dispatches a `topics:add-drops` event
 * and a `topics:update` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to which to add the drops.
 * @param dropIds The IDs of the drops to add to the topic.
 * @param metadata Optional metadata added by the view instance which invoked the function.
 * @returns The updated topic.
 */
export function addDropsToTopic<M extends AddDropMetadata = AddDropMetadata>(
  core: Core,
  topicId: string,
  dropIds: string[],
  metadata?: M,
): Topic {
  // Check that drops exist
  const drops = Drops.get(dropIds);

  // Update the topic
  const topic = updateTopic(core, topicId, {
    drops: FieldValue.arrayUnion(dropIds),
  });

  // Adds the topic as a parent to the drops
  Object.keys(drops).forEach((dropId) => {
    const drop = Drops.addParents(core, dropId, [
      { type: 'topic', id: topicId },
    ]);
    // Update the drop in the DropMap
    drops[drop.id] = drop;
  });

  // Get the topic's view instances
  const viewInstances = Views.getInstances<TopicViewInstance>(topic.views);

  // Call onAddDrops on each of the topic's view instances
  Object.values(viewInstances).forEach((viewInstance) => {
    const view = getTopicView(viewInstance.view);

    if (view.onAddDrops) {
      view.onAddDrops(
        core,
        viewInstance,
        drops,
        metadata || { viewInstance: null },
      );
    }
  });

  // Dispatch 'topics:add-drops' event
  core.dispatch('topics:add-drops', {
    topic,
    drops,
  });

  return topic;
}

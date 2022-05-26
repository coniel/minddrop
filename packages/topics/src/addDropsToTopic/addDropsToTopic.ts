import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { getTopicView } from '../getTopicView';
import { Topic, TopicViewInstance } from '../types';
import { TopicsResource } from '../TopicsResource';

export interface AddDropMetadata {
  /**
   * The ID of the view instance into which the drop was inserted.
   * `null` if the drop was not inserted into a view.
   */
  viewInstance: string | null;
}

/**
 * Adds drops to a topic and dispatches a `topics:topics:add-drops` event.
 * Does not add drops which are already in the topic.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic to which to add the drops.
 * @param dropIds - The IDs of the drops to add to the topic.
 * @param metadata - Optional metadata added by the view instance which invoked the function.
 * @returns The updated topic.
 */
export function addDropsToTopic<
  TMetadata extends AddDropMetadata = AddDropMetadata,
>(core: Core, topicId: string, dropIds: string[], metadata?: TMetadata): Topic {
  // Get the topic
  let topic = TopicsResource.get(topicId);

  // Filter out drops already in topic to avoid duplicates
  const newDropIds = dropIds.filter((dropId) => !topic.drops.includes(dropId));

  // Don't do anything if there are no drops to add
  if (!newDropIds.length) {
    return topic;
  }

  // Get the drops
  const drops = Drops.get(newDropIds);

  // Update the topic
  topic = TopicsResource.update(core, topicId, {
    drops: FieldValue.arrayUnion(newDropIds),
  });

  // Adds the topic as a parent to the drops
  Object.keys(drops).forEach((dropId) => {
    const drop = Drops.addParents(core, dropId, [
      { resource: 'topics:topic', id: topicId },
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

  // Dispatch 'topics:topics:add-drops' event
  core.dispatch('topics:topics:add-drops', {
    topic,
    drops,
  });

  return topic;
}

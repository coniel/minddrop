import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { ViewInstances } from '@minddrop/views';
import { Topic, TopicViewInstanceData } from '../types';
import { TopicsResource } from '../TopicsResource';
import { getTopicViewConfig } from '../getTopicViewConfig';

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
 * Returns the updated topic.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic to which to add the drops.
 * @param dropIds - The IDs of the drops to add to the topic.
 * @param metadata - Optional metadata added by the view instance which invoked the function.
 * @returns The updated topic.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if any of the drops do not exist.
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

  // Update the topic
  topic = TopicsResource.update(core, topicId, {
    drops: FieldValue.arrayUnion(newDropIds),
  });

  // Get the topic's view instances
  const viewInstances = ViewInstances.get<TopicViewInstanceData>(topic.views);

  // Get the updated drops
  const drops = Drops.get(newDropIds);

  // Call onAddDrops on each of the topic's view instances
  Object.values(viewInstances).forEach((viewInstance) => {
    const view = getTopicViewConfig(viewInstance.type);

    if (view.onAddDrops) {
      view.onAddDrops(
        core,
        viewInstance,
        drops,
        metadata || { viewInstance: null },
      );
    }
  });

  // Dispatch 'topics:topic:add-drops' event
  core.dispatch('topics:topic:add-drops', {
    topic,
    drops,
  });

  return topic;
}

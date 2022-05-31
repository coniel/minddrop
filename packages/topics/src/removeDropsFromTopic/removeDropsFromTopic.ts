import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Drops } from '@minddrop/drops';
import { ViewInstances } from '@minddrop/views';
import { Topic, TopicViewInstanceData } from '../types';
import { getTopicViewConfig } from '../getTopicViewConfig';
import { TopicsResource } from '../TopicsResource';

/**
 * Removes drops from a topic.
 * Dispatches a `topics:topic:remove-drops` event.
 *
 * Returns the updated topic.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic from which to remove the drops.
 * @param dropIds - The IDs of the drops to remove.
 * @returns The updated topic.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 */
export function removeDropsFromTopic(
  core: Core,
  topicId: string,
  dropIds: string[],
): Topic {
  // Update the topic
  const topic = TopicsResource.update(core, topicId, {
    drops: FieldValue.arrayRemove(dropIds),
  });

  // Get the updated drops
  const drops = Drops.get(dropIds);

  // Get the topic's view instances
  const viewInstances = ViewInstances.get<TopicViewInstanceData>(topic.views);

  // Call onRemoveDrops on each of the topic's view instances
  Object.values(viewInstances).forEach((viewInstance) => {
    const view = getTopicViewConfig(viewInstance.type);

    if (view.onRemoveDrops) {
      view.onRemoveDrops(core, viewInstance, drops);
    }
  });

  // Dispatch 'topics:topic:remove-drops' event
  core.dispatch('topics:topic:remove-drops', { topic, drops });

  return topic;
}

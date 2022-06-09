import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { ViewInstances } from '@minddrop/views';
import { getTopicViewConfig } from '../getTopicViewConfig';
import { Topic, TopicViewInstanceData } from '../types';
import { TopicsResource } from '../TopicsResource';

/**
 * Archives the specified drops in a topic.
 * Dispatches a `topics:topic:archive-drops` event.
 *
 * Returns the updated topic.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic on which to archive the drops.
 * @param dropIds - The IDs of the drops to archive.
 * @returns The updated topic.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 *
 * @throws ResourceValidationError
 * Thrown if any of the drops do not exist.
 */
export function archiveDropsInTopic(
  core: Core,
  topicId: string,
  dropIds: string[],
): Topic {
  // Update the topic
  const topic = TopicsResource.update(core, topicId, {
    // Remove drop IDs from 'drops'
    drops: FieldValue.arrayRemove(dropIds),
    // Add drop IDs to 'archivedDrops'
    archivedDrops: FieldValue.arrayUnion(dropIds),
  });

  // Get the updated drops
  const drops = Drops.get(dropIds);

  // Get the topic's view instances
  const viewInstances = ViewInstances.get<TopicViewInstanceData>(topic.views);

  // Call onAddDrops on each of the topic's view instances
  Object.values(viewInstances).forEach((viewInstance) => {
    // Get the topic view
    const view = getTopicViewConfig(viewInstance.type);

    if (view.onRemoveDrops) {
      // Call onRemoveDrops with removed drops
      view.onRemoveDrops(core, viewInstance, drops);
    }
  });

  // Dispatch 'topics:topic:archive-drops' event
  core.dispatch('topics:topic:archive-drops', { topic, drops });

  // Return the updated topic
  return topic;
}

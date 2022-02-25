import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { getTopicView } from '../getTopicView';
import { Topic, TopicViewInstance } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Archives the specified drops in a topic and dispatches
 * a `topics:archive-drops` event.
 * Returns the updated topic.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic on which to archive the drops.
 * @param dropIds The IDs of the drops to archive.
 * @returns The updated topic.
 */
export function archiveDropsInTopic(
  core: Core,
  topicId: string,
  dropIds: string[],
): Topic {
  // Get the drops
  const drops = Drops.get(dropIds);

  // Update the topic
  const topic = updateTopic(core, topicId, {
    // Remove drop IDs from 'drops'
    drops: FieldValue.arrayRemove(dropIds),
    // Add drop IDs to 'archivedDrops'
    archivedDrops: FieldValue.arrayUnion(dropIds),
  });

  // Get the topic's view instances
  const viewInstances = Views.getInstances<TopicViewInstance>(topic.views);

  // Call onAddDrops on each of the topic's view instances
  Object.values(viewInstances).forEach((viewInstance) => {
    // Get the topic view
    const view = getTopicView(viewInstance.view);

    if (view.onRemoveDrops) {
      // Call onRemoveDrops with removed drops
      view.onRemoveDrops(core, viewInstance, drops);
    }
  });

  // Dispatch 'topics:archive-drops' event
  core.dispatch('topics:archive-drops', { topic, drops });

  // Return the updated topic
  return topic;
}

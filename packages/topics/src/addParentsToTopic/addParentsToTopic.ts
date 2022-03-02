import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { getTopic } from '../getTopic';
import { restoreTopic } from '../restoreTopic';
import { Topic, TopicParentReference } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Adds parent references to a topic and dispatches a
 * `topics:add-parents` event.
 *
 * @param core A MindTopic core instance.
 * @param topicId The ID of the topic to which to add the parents.
 * @param parentReferences The parent references to add.
 */
export function addParentsToTopic(
  core: Core,
  topicId: string,
  parentReferences: TopicParentReference[],
): Topic {
  // Get the topic
  let topic = getTopic(topicId);

  if (topic.deleted) {
    // Restore the topic if deleted
    restoreTopic(core, topic.id);
    // Replace old parents with new ones
    topic = updateTopic(core, topicId, {
      parents: parentReferences,
    });
  } else {
    // Add new parent references to the topic
    topic = updateTopic(core, topicId, {
      parents: FieldValue.arrayUnion(parentReferences),
    });
  }

  // Dispatch 'topics:add-parents' event
  core.dispatch('topics:add-parents', { topic, parents: parentReferences });

  return topic;
}

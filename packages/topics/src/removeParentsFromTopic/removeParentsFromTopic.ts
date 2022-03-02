import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { deleteTopic } from '../deleteTopic';
import { Topic, TopicParentReference } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Removes parent references from a topic and dispatches a
 * `topics:remove-parents` event.
 *
 * @param core A MindTopic core instance.
 * @param topicId The ID of the topic from which to remove the parents.
 * @param parentReferences The parent references to remove.
 */
export function removeParentsFromTopic(
  core: Core,
  topicId: string,
  parentReferences: TopicParentReference[],
): Topic {
  // Remove parent references from the topic
  let topic = updateTopic(core, topicId, {
    parents: FieldValue.arrayFilter<TopicParentReference>(
      (reference) =>
        !parentReferences.find(
          (remove) =>
            remove.type === reference.type && remove.id === reference.id,
        ),
    ),
  });

  // Delete the topic if no longer has any parents
  if (topic.parents.length === 0) {
    topic = deleteTopic(core, topicId);
  }

  // Dispatch 'topics:remove-parents' event
  core.dispatch('topics:remove-parents', { topic, parents: parentReferences });

  return topic;
}

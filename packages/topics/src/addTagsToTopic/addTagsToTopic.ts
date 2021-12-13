import { Core } from '@minddrop/core';
import { Tags } from '@minddrop/tags';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Adds tags to a topic and dispatches a `topics:add-tags` event
 * and a `topics:update` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to which to add the tags.
 * @param tagIds The IDs of the tags to add to the topic.
 * @returns The updated topic.
 */
export function addTagsToTopic(
  core: Core,
  topicId: string,
  tagIds: string[],
): Topic {
  // Check that tags exist
  const tags = Tags.get(tagIds);

  const topic = updateTopic(core, topicId, {
    tags: FieldValue.arrayUnion(tagIds),
  });

  core.dispatch('topics:add-tags', {
    topic,
    tags,
  });

  return topic;
}

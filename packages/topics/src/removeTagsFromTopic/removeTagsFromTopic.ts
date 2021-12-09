import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Tags } from '@minddrop/tags';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Removes tags from a topic and dispatches a `topics:remove-tags` event
 * and a `topics:update` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic from which to remove the tags.
 * @param tagIds The IDs of the tags to remove.
 * @returns The updated topic.
 */
export function removeTagsFromTopic(
  core: Core,
  topicId: string,
  tagIds: string[],
): Topic {
  const tags = Tags.get(tagIds);
  const topic = updateTopic(core, topicId, {
    tags: FieldValue.arrayRemove(tagIds),
  });

  core.dispatch('topics:remove-tags', { topic, tags });

  return topic;
}

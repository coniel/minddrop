import { Core } from '@minddrop/core';
import { Tags } from '@minddrop/tags';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { TopicsResource } from '../TopicsResource';

/**
 * Adds tags to a topic.
 * Dispatches a `topics:topic:add-tags` event.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic to which to add the tags.
 * @param tagIds - The IDs of the tags to add to the topic.
 * @returns The updated topic.
 */
export function addTagsToTopic(
  core: Core,
  topicId: string,
  tagIds: string[],
): Topic {
  // Get the tags
  const tags = Tags.get(tagIds);

  // Add the tag IDs to the topic
  const topic = TopicsResource.update(core, topicId, {
    tags: FieldValue.arrayUnion(tagIds),
  });

  // Dispatch a 'topics:topic:add-tags' event
  core.dispatch('topics:topic:add-tags', {
    topic,
    tags,
  });

  return topic;
}

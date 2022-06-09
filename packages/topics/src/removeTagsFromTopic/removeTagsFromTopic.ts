import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Tags } from '@minddrop/tags';
import { Topic } from '../types';
import { TopicsResource } from '../TopicsResource';

/**
 * Removes tags from a topic.
 * Dispatches a `topics:topic:remove-tags` event.
 *
 * Returns the updated topic.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic from which to remove the tags.
 * @param tagIds - The IDs of the tags to remove.
 * @returns The updated topic.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic does not exist.
 */
export function removeTagsFromTopic(
  core: Core,
  topicId: string,
  tagIds: string[],
): Topic {
  // Get the tags
  const tags = Tags.get(tagIds);

  // Update the topic, removing the specified tags
  const topic = TopicsResource.update(core, topicId, {
    tags: FieldValue.arrayRemove(tagIds),
  });

  // Dispatch a 'topics:topic:remove-tags' event
  core.dispatch('topics:topic:remove-tags', { topic, tags });

  return topic;
}

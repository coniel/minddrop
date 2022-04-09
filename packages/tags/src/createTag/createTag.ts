import { Core } from '@minddrop/core';
import { generateTag } from '../generateTag';
import { TagsStore } from '../TagsStore';
import { CreateTagData, Tag } from '../types';

/**
 * Creates a new tag and dispatches a `tags:create` event.
 * Returns the new tag.
 *
 * @param core A MindDrop core instance.
 * @param data The tag data.
 * @returns The newly created tag.
 */
export function createTag(core: Core, data: CreateTagData): Tag {
  // Generate a new tag with the provided data
  const tag = generateTag(data);

  // Add tag to the store
  TagsStore.set(tag);

  // Dispatch a 'tags:create' event
  core.dispatch('tags:create', tag);

  return tag;
}

import { Core } from '@minddrop/core';
import { generateTag } from '../generateTag';
import { CreateTagData, Tag } from '../types';
import { useTagsStore } from '../useTagsStore';

/**
 * Creates a new tag and dispatches a `tags:create` event.
 * Returns the new tag.
 *
 * @param core A MindDrop core instance.
 * @param data The tag property values.
 * @returns The newly created tag.
 */
export function createTag(core: Core, data: CreateTagData): Tag {
  const tag = generateTag(data);

  // Add tag to the store
  useTagsStore.getState().setTag(tag);

  // Dispatch 'tags:create' event
  core.dispatch('tags:create', tag);

  return tag;
}

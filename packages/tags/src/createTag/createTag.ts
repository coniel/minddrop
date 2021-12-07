import { Core } from '@minddrop/core';
import { generateTag } from '../generateTag';
import { CreateTagData, Tag } from '../types';

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

  core.dispatch('tags:create', tag);

  return tag;
}

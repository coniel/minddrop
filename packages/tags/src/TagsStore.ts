import { createResourceStore } from '@minddrop/core';
import { Tag } from './types';

export const TagsStore = createResourceStore<Tag>();

/**
 * Returns a tag by ID or `null` if no tag was found.
 *
 * @param tagId The ID of the tag to retrieve.
 * @returns The requested tag or `null`.
 */
export const useTag = TagsStore.useResource;

/**
 * Returns a `{ [id]: Tag }` map of tags matching
 * the provided IDs.
 *
 * @param tagIds The IDs of the tags to retrieve.
 * @returns A map of the requested tags.
 */
export const useTags = TagsStore.useResources;

/**
 * Returns a `{ [id]: Tag }` map of all tags.
 *
 * @returns A map of all tags.
 */
export const useAllTags = TagsStore.useAllResources;

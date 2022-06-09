import { TagsResource } from './TagsResource';
import { TagsApi } from './types';

const { hooks, ...api } = TagsResource;

export const Tags: TagsApi = {
  ...api,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};

/*
 * Returns a tag by ID or `null` if it does not exist.
 *
 * @param documentId - The ID of the tag to retrieve.
 * @returns The requested tag or `null`.
 */
export const useTag = hooks.useDocument;

/**
 * Returns a `{ [id]: Tag }` map of tags by ID.
 *
 * @param documentIds - The IDs of the tags to retrieve.
 * @param filters - Optional filters by which to filter the returned tag docuemnts.
 * @returns A `{ [id]: Tag }` map of the requested tags.
 */
export const useTags = hooks.useDocuments;

/**
 * Returns a `{ [id]: Tag }` map of all tags.
 *
 * @param filters - Optional filters by which to filter the returned tag docuemnts.
 * @returns A `{ [id]: Tag }` map of all tags.
 */
export const useAllTags = hooks.useAllDocuments;

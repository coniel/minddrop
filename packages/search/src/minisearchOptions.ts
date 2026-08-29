import { type Options as MiniSearchOptions } from 'minisearch';
import type { SearchDocument } from './types';

/**
 * Shared MiniSearch configuration used for both creating new
 * instances and loading persisted ones. The `storeFields` list
 * must match the `StoredSearchFields` type.
 */
export const MINISEARCH_OPTIONS: MiniSearchOptions<SearchDocument> = {
  fields: ['title', 'content', 'properties', 'tags'],
  storeFields: ['type', 'databaseId', 'databaseName', 'databaseIcon', 'title'],
  searchOptions: {
    boost: { title: 2, tags: 2, properties: 1.5 },
    fuzzy: (term: string) => {
      // Exact match only for very short terms
      if (term.length <= 2) {
        return 0;
      }

      // Allow a single typo in short terms
      if (term.length <= 5) {
        return 1;
      }

      return 2;
    },
    prefix: true,
    boostDocument: (_id, _term, storedFields) =>
      storedFields?.type === 'database' ? 1.5 : 1,
  },
};

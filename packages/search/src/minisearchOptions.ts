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
    boost: { title: 3, tags: 2, properties: 1.5 },
    // Derate fuzzy (typo) matches so they cannot outrank exact
    // and prefix matches, e.g. a fuzzy title match on "data"
    // outscoring a prefix title match on "databases"
    weights: { fuzzy: 0.2, prefix: 0.375 },
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

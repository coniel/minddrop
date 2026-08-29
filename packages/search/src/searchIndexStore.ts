import type MiniSearch from 'minisearch';
import type { SearchDocument } from './types';

/**
 * Per-workspace MiniSearch instances, keyed by workspace ID.
 * Module state shared by the search index API functions.
 */
export const searchIndexes = new Map<string, MiniSearch<SearchDocument>>();

import type MiniSearch from 'minisearch';
import type { SearchDocument } from './types';

/**
 * Removes a document from a MiniSearch index if present.
 * MiniSearch throws when discarding an unknown document ID;
 * absence is acceptable wherever this is used.
 *
 * @param miniSearch - The index to remove the document from.
 * @param documentId - The ID of the document to remove.
 */
export function discardIndexDocument(
  miniSearch: MiniSearch<SearchDocument>,
  documentId: string,
): void {
  try {
    miniSearch.discard(documentId);
  } catch {
    // Document did not exist
  }
}

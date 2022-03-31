import { mapById } from '@minddrop/utils';
import { RichTextDocumentNotFoundError } from '../errors';
import { RichTextDocumentMap } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Retrieves rich text documents by ID. Returns a
 * `{ [id]: RichTextDocument }` map of the requested documents.
 *
 * - Throws a `RichTextDocumentNotFoundError` if any of the documents
 *   do not exist.
 *
 * @param documentIds The IDs of the rich text documents to retrieve.
 * @returns A `{ [id]: RichTextDocument }` map of the requested rich text documents.
 */
export function getRichTextDocuments(
  documentIds: string[],
): RichTextDocumentMap {
  // Get all document sfrom the rich text store
  const { documents } = useRichTextStore.getState();

  // Get the requested documents
  const requestedDocuments = documentIds.map((id) => documents[id]);

  if (requestedDocuments.includes(undefined)) {
    // If one or more of the requested items do not exist, make
    // a list of the missing document IDs
    const missingItemIds = documentIds.filter((id) => !documents[id]);

    // Throw a `RichTextDocumentNotFoundError` error providing the
    // missing document IDs.
    throw new RichTextDocumentNotFoundError(missingItemIds);
  }

  // Return a map of the requested documents
  return mapById(requestedDocuments);
}

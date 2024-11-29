import { Document, PersistedDocumentData } from '../types';

/**
 * Strips derived data from a document and returns the remaining
 * data as a JSON string.
 *
 * @param  document - A document or persisted document data object.
 * @returns A JSON string of the document data.
 */
export function serializeDocumentToJsonString(
  document: Document | PersistedDocumentData,
): string {
  // Pick out fields to exclude from serialized data
  const { path, title, wrapped, ...fileData } = document as Document;

  return JSON.stringify(fileData);
}

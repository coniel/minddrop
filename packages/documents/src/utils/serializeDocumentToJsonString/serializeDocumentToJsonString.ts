import { Blocks } from '@minddrop/blocks';
import { DocumentNotFoundError } from '../../errors';
import { getDocument } from '../../getDocument';
import { SerializableDocumentData } from '../../types';
import { getDocumentViews } from '../../getDocumentViews';

/**
 * Strips derived data from a document and returns the remaining
 * data as a JSON string.
 *
 * @param  document - A document or persisted document data object.
 * @returns A JSON string of the document data.
 */
export function serializeDocumentToJsonString(id: string): string {
  // Get the doument
  const document = getDocument(id);

  // Ensure the document exists
  if (!document) {
    throw new DocumentNotFoundError(id);
  }

  // Pick out derived fields to exclude from serialized data
  const { path, wrapped, ...serializableData } = document;

  const serializedDocument: SerializableDocumentData = {
    ...serializableData,
    blocks: Blocks.get(document.blocks),
    views: getDocumentViews(document.views),
  };

  return JSON.stringify(serializedDocument);
}

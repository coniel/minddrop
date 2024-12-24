import {
  BlockDocumentMap,
  DocumentParentMap,
  DocumentViewDocumentMap,
} from '../DocumentsStore';
import { getDocument } from '../getDocument';
import { Document } from '../types';

/**
 * Returns the parent document of the given child resource (subdocument, document view, or block).
 *
 * @param childResourceId - The ID of the child resource.
 * @returns The parent document of the given child resource.
 *
 * @throws {ParentDocumentNotFoundError} Thrown if the parent document is not found.
 */
export function getParentDocument(childResourceId: string): Document | null {
  // Attempt to get the document ID from the document view or block map
  const documentId =
    DocumentViewDocumentMap.get(childResourceId) ||
    BlockDocumentMap.get(childResourceId) ||
    DocumentParentMap.get(childResourceId);

  let document: Document | null = null;

  // Get the document
  if (documentId) {
    document = getDocument(documentId);
  }

  return document || null;
}

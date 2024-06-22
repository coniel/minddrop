import { Document, DocumentMetadata } from '../../types';

/**
 * Returns a document's metadata.
 *
 * @document - The document.
 * @returns The document metadata.
 */
export function getDocumentMetadata(document: Document): DocumentMetadata {
  return {
    icon: document.icon,
  };
}

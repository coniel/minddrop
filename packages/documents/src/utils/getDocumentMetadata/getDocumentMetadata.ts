import { Document, DocumentProperties } from '../../types';

/**
 * Returns a document's metadata.
 *
 * @document - The document.
 * @returns The document metadata.
 */
export function getDocumentMetadata(document: Document): DocumentProperties {
  return {
    icon: document.icon,
  };
}

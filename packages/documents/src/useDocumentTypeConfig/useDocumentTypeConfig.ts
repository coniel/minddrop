import { DocumentTypeConfig } from '../types';
import { DocumentTypeConfigsStore } from '../DocumentTypeConfigsStore';

/**
 * Returns the type configuration for a document type,
 * or null if the document type is not registered.
 *
 * @param fileType - The file type of the document.
 * @returns The document type configuration, or null.
 */
export function useDocumentTypeConfig(
  fileType: string,
): DocumentTypeConfig | null {
  return DocumentTypeConfigsStore.get(fileType) || null;
}

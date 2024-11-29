import { DocumentViewTypeConfig } from '../types';
import { DocumentViewTypeConfigsStore } from '../DocumentViewTypeConfigsStore';

/**
 * Returns the configuration object for a document view type,
 * *if registered* or null if the document type is not registered.
 *
 * @param id - The ID of the document view type.
 * @returns The document view type configuration, or null.
 */
export function useDocumentViewTypeConfig(
  id: string,
): DocumentViewTypeConfig | null {
  return DocumentViewTypeConfigsStore.useItem(id) || null;
}

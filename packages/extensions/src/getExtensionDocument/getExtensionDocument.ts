import { ExtensionDocument } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Gets the extension document for a given extension.
 *
 * @param extensionId The ID of the extension for which to retrieve the document.
 */
export function getExtensionDocument(extensionId: string): ExtensionDocument {
  return useExtensionsStore.getState().extensionDocuments[extensionId] || null;
}

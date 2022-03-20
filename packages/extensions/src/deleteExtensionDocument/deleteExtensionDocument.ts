import { Core } from '@minddrop/core';
import { ExtensionDocumentNotFoundError } from '../errors';
import { getExtensionDocument } from '../getExtensionDocument';
import { ExtensionDocument } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Deletes an extension document and dispatches a
 * `extensions:delete-document` event.
 *
 * Throws a ExtensionDocumentNotFoundError if the
 * extension document does not exist.
 *
 * Returns the deleted extension document.
 *
 * @param core A MindDrop core instance.
 * @param extensionId The ID of the extension for which to delete the document.
 */
export function deleteExtensionDocument(
  core: Core,
  extensionId: string,
): ExtensionDocument {
  // Get the extension document
  const document = getExtensionDocument(extensionId);

  if (!document) {
    // Throw an error if the document does not exist
    throw new ExtensionDocumentNotFoundError(extensionId);
  }

  // Remove the document from the extension store
  useExtensionsStore.getState().removeExtensionDocument(extensionId);

  // Dispatch a 'extensions:delete-document' event
  core.dispatch('extensions:delete-document', document);

  // Return the deleted document
  return document;
}

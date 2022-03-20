import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { ExtensionDocumentNotFoundError } from '../errors';
import { getExtensionDocument } from '../getExtensionDocument';
import { ExtensionDocument, UpdateExtensionDocumentData } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Updates a given extension's document and dispatches a
 * `extensions:update-document` event.
 *
 * Throws a `ExtensionDocumentNotFound` error if the
 * extension document does not exist.
 *
 * Returns the updated docuemnt.
 *
 * @param core A MindDrop core instance.
 * @param extensionId The ID of the extension for which to update the document.
 * @param data The update data.
 * @returns The updated extension document.
 */
export function updateExtensionDocument(
  core: Core,
  extensionId: string,
  data: UpdateExtensionDocumentData,
): ExtensionDocument {
  // Get the extension document
  const document = getExtensionDocument(extensionId);

  if (!document) {
    // Throw an error if the document does not exist
    throw new ExtensionDocumentNotFoundError(extensionId);
  }

  // Create the update
  const update = createUpdate(document, data);

  // Update the document in the extensions store
  useExtensionsStore.getState().setExtensionDocument(update.after);

  // Dispatch a `extensions:update-document` event
  core.dispatch('extensions:update-document', update);

  // Return the updated document
  return update.after;
}

import { Core } from '@minddrop/core';
import { generateExtensionDocument } from '../generateExtensionDocument';
import { ExtensionDocument } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Creates an extension document for a given extension and
 * dispatches a `extensions:create-document` event.
 *
 * @param core A MindDrop core instace.
 * @param extensionId The extension ID.
 * @returns A new extension document.
 */
export function createExtensionDocument(
  core: Core,
  extensionId: string,
): ExtensionDocument {
  // Generate a new extension document
  const document = generateExtensionDocument(extensionId);

  // Add the document to the extensions store
  useExtensionsStore.getState().setExtensionDocument(document);

  // Dispatch a 'extensions:create-document' event
  core.dispatch('extensions:create-document', document);

  return document;
}

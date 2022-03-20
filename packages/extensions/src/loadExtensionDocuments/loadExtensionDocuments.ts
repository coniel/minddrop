import { Core } from '@minddrop/core';
import { ExtensionDocument } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Loads extension documents into the store and dispatches
 * a `extensions:load-documents` event.
 *
 * @param core A MindDrop core instance.
 * @param extensionDocuments The extension documents to load.
 */
export function loadExtensionDocuments(
  core: Core,
  extensionDocuments: ExtensionDocument[],
): void {
  // Load the documents into the store
  useExtensionsStore.getState().loadExtensionDocuments(extensionDocuments);

  // Dispatch a 'extensions:load-documents' event
  core.dispatch('extensions:load-documents', extensionDocuments);
}

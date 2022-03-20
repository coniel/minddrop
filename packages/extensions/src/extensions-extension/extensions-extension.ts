import { Core } from '@minddrop/core';
import { clearExtensions } from '../clearExtensions';
import { loadExtensionDocuments } from '../loadExtensionDocuments';
import { ExtensionDocument } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

export function onRun(core: Core): void {
  // Register the 'extensions:extension' resource which
  // stores extension state and configuration.
  core.registerResource<ExtensionDocument>({
    type: 'extensions:extension',
    createEvent: 'extensions:create-document',
    updateEvent: 'extensions:update-document',
    deleteEvent: 'extensions:delete-document',
    onLoad: (documents) => loadExtensionDocuments(core, documents),
    onChange: (document, deleted) => {
      if (deleted) {
        // Document was deleted, remove it from the store
        useExtensionsStore
          .getState()
          .removeExtensionDocument(document.extension);
      } else {
        // Document was added or updated, set it in the store
        useExtensionsStore.getState().setExtensionDocument(document);
      }
    },
  });
}

export function onDisable(core: Core): void {
  // Clear the store
  clearExtensions(core);

  // Unregsiter the 'extensions:extension' resource
  core.unregisterResource('extensions:extension');
}

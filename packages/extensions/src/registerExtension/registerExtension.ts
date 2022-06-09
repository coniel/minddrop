import { Core } from '@minddrop/core';
import { getExtension } from '../getExtension';
import { Extension, ExtensionConfig } from '../types';
import { ExtensionsResource } from '../ExtensionsResource';
import { ExtensionConfigsStore } from '../ExtensionConfigsStore';

/**
 * Registers a new extension.
 * Dispatches a `extensions:extension:register` event.
 *
 * If the extension was not previously registered, creates
 * an associated extension document for it.
 *
 * Returns the registered extension.
 *
 * @param core - A MindDrop core instance.
 * @param extensionConfig - The config of the extension to register.
 * @returns The registered extension.
 */
export function registerExtension(
  core: Core,
  extensionConfig: ExtensionConfig,
): Extension {
  // Adds the extension config to the store
  ExtensionConfigsStore.register(extensionConfig);

  // Get the extension document
  let document = Object.values(ExtensionsResource.getAll()).find(
    (doc) => doc.extension === extensionConfig.id,
  );

  if (!document) {
    // Create a document for the extension if it does not already have one
    document = ExtensionsResource.create(core, {
      extension: extensionConfig.id,
    });
  }

  // Get the extension (combines the config and document)
  const extension = getExtension(extensionConfig.id);

  // Dispatches a 'extensions:extension:register' event
  core.dispatch('extensions:extension:register', extension);

  return extension;
}

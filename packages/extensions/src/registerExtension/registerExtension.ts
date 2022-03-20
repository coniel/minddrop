import { Core } from '@minddrop/core';
import { createExtensionDocument } from '../createExtensionDocument';
import { getExtension } from '../getExtension';
import { getExtensionDocument } from '../getExtensionDocument';
import { Extension, ExtensionConfig } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Registers a new extension and dispatches a `extensions:register`
 * event. If the extension was not previously registered, creates
 * an associated ExtensionDocument for it.
 *
 * Returns the registered extension.
 *
 * @param core A MindDrop core instance.
 * @param extensionConfig The config of extension to register.
 * @returns The registered extension.
 */
export function registerExtension(
  core: Core,
  extensionConfig: ExtensionConfig,
): Extension {
  // Adds the extension config to the store
  useExtensionsStore.getState().setExtensionConfig(extensionConfig);

  // Get the extension document
  let document = getExtensionDocument(extensionConfig.id);

  if (!document) {
    // Create a document for the extension if it does not already have one
    document = createExtensionDocument(core, extensionConfig.id);
  }

  // Get the extension (combines the config and document)
  const extension = getExtension(extensionConfig.id);

  // Dispatches a 'extensions:register' event
  core.dispatch('extensions:register', extension);

  return extension;
}

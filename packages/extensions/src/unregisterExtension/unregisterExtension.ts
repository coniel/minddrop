import { Core } from '@minddrop/core';
import { getExtension } from '../getExtension';
import { ExtensionsResource } from '../ExtensionsResource';
import { ExtensionConfigsStore } from '../ExtensionConfigsStore';

/**
 * Unregisters an extension.
 * Dispatches a `extensions:extension:unregister` event.
 *
 * @param core - A MindDrop core instance.
 * @param extensionId - The ID of the extension to unregister.
 */
export function unregisterExtension(core: Core, extensionId: string): void {
  // Get the extension
  const extension = getExtension(extensionId);
  // Get the extension config
  const config = ExtensionConfigsStore.get(extension.id);

  // Remove the extension config from the store
  ExtensionConfigsStore.unregister(config);

  // Delete the extension document
  ExtensionsResource.delete(core, extension.document);

  // Dispatch a 'extensions:extension:unregister' event
  core.dispatch('extensions:extension:unregister', extension);
}

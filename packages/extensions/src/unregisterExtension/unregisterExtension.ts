import { Core } from '@minddrop/core';
import { getExtension } from '../getExtension';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Removes an extension from the extensions store and
 * dispatches a `extensions:unregister` event.
 *
 * @param core A MindDrop core instance.
 * @param extensionId The ID of the extension to unregister.
 */
export function unregisterExtension(core: Core, extensionId: string): void {
  // Get the extension
  const extension = getExtension(extensionId);

  // Remove the extension from the store
  useExtensionsStore.getState().removeExtension(extensionId);

  // Dispatch a 'extensions:unregister' event
  core.dispatch('extensions:unregister', extension);
}

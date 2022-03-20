import { ExtensionNotRegisteredError } from '../errors';
import { ExtensionConfig } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Returns the extension config for a given extension.
 * Throws a `ExtensionNotRegisteredError` if the extension
 * is not registered.
 *
 * @param extensionId The ID of the extension.
 */
export function getExtensionConfig(extensionId: string): ExtensionConfig {
  // Get the extension config from the store
  const config = useExtensionsStore.getState().extensionConfigs[extensionId];

  if (!config) {
    // Throw an error if the extension config does not exist
    throw new ExtensionNotRegisteredError(extensionId);
  }

  return config;
}

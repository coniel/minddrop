import { ExtensionNotRegisteredError } from '../errors';
import { ExtensionConfig } from '../types';
import { ExtensionConfigsStore } from '../ExtensionConfigsStore';

/**
 * Returns the extension config for a given extension.
 *
 * @param extensionId - The ID of the extension.
 * @returns The requested extension's config.
 *
 * @throws ExtensionNotRegisteredError
 * Thrown if the extension is not registered.
 */
export function getExtensionConfig(extensionId: string): ExtensionConfig {
  // Get the extension config from the configs store
  const config = ExtensionConfigsStore.get(extensionId);

  if (!config) {
    // Throw an error if the extension config does not exist
    throw new ExtensionNotRegisteredError(extensionId);
  }

  return config;
}

import { ExtensionConfigsStore } from '../ExtensionConfigsStore';
import { getExtension } from '../getExtension';
import { Extension } from '../types';

/**
 * Returns an array of all registered extensions,
 * including disabled ones.
 *
 * @returns An array of extensions.
 */
export function useAllExtensions(): Extension[] {
  // Get all extension configs
  const configs = ExtensionConfigsStore.useAllConfigs();

  // Return matching extensions
  return configs.map((config) => getExtension(config.id));
}

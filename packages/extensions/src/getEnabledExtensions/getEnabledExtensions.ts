import { Extension } from '../types';
import { ExtensionConfigsStore } from '../ExtensionConfigsStore';
import { getExtension } from '../getExtension';

/**
 * Returns an array of all enabled extensions.
 *
 * @returns An array containing all enabled extensions.
 */
export function getEnabledExtensions(): Extension[] {
  const configs = ExtensionConfigsStore.getAll();

  return configs
    .map((config) => getExtension(config.id))
    .filter((extension) => extension.enabled);
}

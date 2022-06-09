import { getExtension } from '../getExtension';
import { Extension } from '../types';
import { ExtensionConfigsStore } from '../ExtensionConfigsStore';

/**
 * Returns an array of all registered extensions,
 * including disabled ones.
 *
 * @returns An array containing all registered extensions.
 */
export function getRegisteredExtensions(): Extension[] {
  const configs = ExtensionConfigsStore.getAll();

  return configs.map((config) => getExtension(config.id));
}

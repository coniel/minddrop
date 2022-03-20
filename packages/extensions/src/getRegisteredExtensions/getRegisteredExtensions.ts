import { getExtension } from '../getExtension';
import { Extension } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Returns an array of all registered extensions,
 * including disabled ones.
 *
 * @returns An array containing all registered extensions.
 */
export function getRegisteredExtensions(): Extension[] {
  const { extensionConfigs } = useExtensionsStore.getState();

  return Object.keys(extensionConfigs).map((id) => getExtension(id));
}

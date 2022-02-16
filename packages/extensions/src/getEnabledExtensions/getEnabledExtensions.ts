import { Extension } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Returns an array of all enabled extensions.
 *
 * @returns An array containing all enabled extensions.
 */
export function getEnabledExtensions(): Extension[] {
  const { extensions } = useExtensionsStore.getState();

  return Object.values(extensions).filter((extension) => extension.enabled);
}

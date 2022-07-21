import { Extension } from '../types';
import { useAllExtensions } from '../useAllExtensions';

/**
 * Returns an array of all enabled extensions.
 *
 * @returns An array of extensions.
 */
export function useEnabledExtensions(): Extension[] {
  // Get all registered extensions
  const extensions = useAllExtensions();

  // Return enabled extensions
  return extensions.filter((extension) => extension.enabled);
}

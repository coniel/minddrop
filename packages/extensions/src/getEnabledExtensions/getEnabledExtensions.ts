import { getRegisteredExtensions } from '../getRegisteredExtensions';
import { Extension } from '../types';

/**
 * Returns an array of all enabled extensions.
 *
 * @returns An array containing all enabled extensions.
 */
export function getEnabledExtensions(): Extension[] {
  const extensions = getRegisteredExtensions();

  return extensions.filter((extension) => extension.enabled);
}

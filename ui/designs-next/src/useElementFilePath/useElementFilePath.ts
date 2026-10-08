import { DesignElement } from '@minddrop/designs-next';
import { useElementProperty } from '../useElementProperty';

/**
 * Returns the path of the file the property an element maps to
 * holds. Returns null without an element, when it maps to no
 * property, when the provided properties do not include it, or
 * when the property holds anything but a single file's path.
 *
 * @param element - The design element.
 * @returns The file's path, or null.
 */
export function useElementFilePath(
  element: DesignElement | undefined,
): string | null {
  // Read the property the element maps to
  const property = useElementProperty(element);

  // The property's value, which names a file when it is a path
  const value = property?.value;

  // Return a non-empty string value as the file's path
  if (typeof value === 'string' && value) {
    return value;
  }

  // Any other value names no file
  return null;
}

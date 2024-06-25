/**
 * Removes the ".extension" part of a file path if it has one.
 *
 * @param path - The path to remove the extension from.
 * @returns The path without the extension.
 */
export function removeFileExtension(path: string): string {
  return path.replace(/\.[^/.]+$/, '');
}

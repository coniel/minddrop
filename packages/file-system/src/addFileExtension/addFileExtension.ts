/**
 * Adds a file extension to a path.
 *
 * @param path - The path to add the extension to.
 * @param extension - The extension to add.
 * @returns The path with the extension.
 */
export function addFileExtension(path: string, extension: string): string {
  return `${path}.${extension}`;
}

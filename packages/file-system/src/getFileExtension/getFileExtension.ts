/**
 * Returns the file extension of a path.
 *
 * @param path - The path to get the file extension from.
 * @returns The file extension or an empty string if the path is not a file.
 */
export function getFileExtension(path: string): string {
  return path.split('.').pop() || '';
}

/**
 * Gets the file name from a file path.
 *
 * @param path - The file path.
 * @returns The file name.
 */
export function fileNameFromPath(path: string): string {
  return path.split('/').slice(-1)[0];
}

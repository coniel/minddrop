/**
 * Gets the path of the parent dir of a path.
 *
 * @param path - The path from which to get the parent.
 * @returns The parent dir path.
 */
export function parentDirPath(path: string): string {
  return path.split('/').slice(0, -1).join('/');
}

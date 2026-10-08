/**
 * Checks whether a path is a directory's own path or a path inside the
 * directory, at any depth.
 *
 * @param path - The path to check.
 * @param dirPath - The directory path.
 * @returns True if the path is at or under the directory path.
 */
export function isAtOrUnder(path: string, dirPath: string): boolean {
  return path === dirPath || path.startsWith(`${dirPath}/`);
}

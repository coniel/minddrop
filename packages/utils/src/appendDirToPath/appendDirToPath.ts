/**
 * Appends a directory name to a path, ensuring
 * that there is a '/' between them.
 *
 * @param dirName - The directory name.
 * @param path - The path to which to append.
 * @returns The new path.
 */
export function appendDirToPath(dirName: string, path: string): string {
  // Add trailing '/' to path if needed
  const pathWithTrailingSlash = path.endsWith('/') ? path : `${path}/`;

  // Generate new path
  return `${pathWithTrailingSlash}${dirName}`;
}

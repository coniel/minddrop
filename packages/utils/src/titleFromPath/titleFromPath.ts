/**
 * Gets a document's title from its path.
 *
 * @param path - The document path.
 * @returns The document title.
 */
export function titleFromPath(path: string): string {
  // Get the last path segment and remove file extension
  return path.split('/').slice(-1)[0].split('.').slice(0, -1).join('.');
}

/**
 * Gets a document's title from its path.
 *
 * @param path - The document path.
 * @returns The document title.
 */
export function titleFromPath(path: string): string {
  // Get the last path segment and remove '.md' extension
  return path.split('/').slice(-1)[0].slice(0, -3);
}

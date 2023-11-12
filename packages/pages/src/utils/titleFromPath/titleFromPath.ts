/**
 * Gets a page's title from its path.
 *
 * @param path - The page path.
 * @returns The page title.
 */
export function titleFromPath(path: string): string {
  // Get the last path segment and remove '.md' extension
  return path.split('/').slice(-1)[0].slice(0, -3);
}

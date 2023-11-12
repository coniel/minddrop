import { titleFromPath } from '../titleFromPath';

/**
 * Checks whether a page is wrapped based on its path.
 *
 * @param path - The page path.
 * @returns Whether or not the page is wrapped.
 */
export function isWrapped(path: string): boolean {
  const pageTitle = titleFromPath(path);

  // If the page markdown file's parent directory
  // has the same name as the page, it's wrapped.
  return path.split('/').slice(-2)[0] === pageTitle;
}

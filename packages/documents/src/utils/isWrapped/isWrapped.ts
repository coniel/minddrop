import { titleFromPath } from '../titleFromPath';

/**
 * Checks whether a document is wrapped based on its path.
 *
 * @param path - The document path.
 * @returns Whether or not the document is wrapped.
 */
export function isWrapped(path: string): boolean {
  const documentTitle = titleFromPath(path);

  // If the document markdown file's parent directory
  // has the same name as the document, it's wrapped.
  return path.split('/').slice(-2)[0] === documentTitle;
}

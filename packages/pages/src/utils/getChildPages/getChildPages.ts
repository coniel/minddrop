import { Page } from '../../types';
import { isWrapped } from '../../utils';

/**
 * Returns a path's direct child pages from the given
 * list of pages.
 *
 * @param path - The root path from which to get the children.
 * @param pages - The pages from which to match.
 * @returns An array of pages.
 */
export function getPageChildren(path: string, pages: Page[]): Page[] {
  let rootPathParts = path.split('/');

  // If the path is a markdown file, use the file's
  // parent dir as the root path.
  if (path.endsWith('.md')) {
    rootPathParts = rootPathParts.slice(0, -1);
  }

  const rootPath = rootPathParts.join('/');

  return (
    pages
      // Filter out the page itself
      .filter((page) => page.path !== path)
      // Filter out pages which are not descendants
      .filter((page) => page.path.startsWith(rootPath))
      .filter((page) => {
        const pagePathLength = page.path.split('/').length;

        return (
          // Page is a file inside parent dir
          pagePathLength === rootPathParts.length + 1 ||
          // Page is one level deeper in a dir which is a wrapper for it
          (pagePathLength === rootPathParts.length + 2 && isWrapped(page.path))
        );
      })
  );
}

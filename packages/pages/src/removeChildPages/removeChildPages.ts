import { PagesStore } from '../PagesStore';
import { getChildPages } from '../utils';

/**
 * Recursively removes all child pages of the given parent path.
 *
 * @param parentPath - The path of the parent
 */
export function removeChildPages(parentPath: string): void {
  // Get the child pages
  const childPages = getChildPages(parentPath, PagesStore.getState().pages);

  // Remove each child page and its own child pages
  // if it has any.
  childPages.forEach((page) => {
    PagesStore.getState().remove(page.path);
    removeChildPages(page.path);
  });
}

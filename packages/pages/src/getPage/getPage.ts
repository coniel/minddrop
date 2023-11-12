import { Page } from '../types';
import { PagesStore } from '../PagesStore';

/**
 * Returns a page by path, or null if it does not exist.
 *
 * @param path - The page path.
 * @returns A page or null.
 */
export function getPage(path: string): Page | null {
  return PagesStore.getState().pages.find((page) => page.path === path) || null;
}

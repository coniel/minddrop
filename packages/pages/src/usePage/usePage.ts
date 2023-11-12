import { Page } from '../types';
import { PagesStore as usePagesStore } from '../PagesStore';

/**
 * Returns a page from the given path, or `null` if there is
 * no page with the given path.
 *
 * @param path - The page path.
 * @returns A page object or null.
 */
export function usePage(path: string): Page | null {
  return usePagesStore().pages.find((page) => page.path === path) || null;
}

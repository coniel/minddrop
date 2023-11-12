import { Page } from '../types';
import { PagesStore as usePagesStore } from '../PagesStore';
import { getPageChildren } from '../utils';

/**
 * Returns a list of pages which are direct children of
 * the specified path.
 *
 * @param path - The parent path.
 * @returns An array of child pages.
 */
export function useChildPages(path: string): Page[] {
  // Get all pages
  const { pages } = usePagesStore();

  // Get child pages
  return getPageChildren(path, pages);
}

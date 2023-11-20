import { Page } from '../types';
import { PagesStore as usePagesStore } from '../PagesStore';
import { getChildPages } from '../utils';

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

  // Get child pages sorted by title in alphabetical order
  return getChildPages(path, pages).sort((a, b) =>
    a.title > b.title ? 1 : -1,
  );
}

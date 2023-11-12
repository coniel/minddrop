import { Page } from '../types';
import { PagesStore as usePagesStore } from '../PagesStore';

/**
 * Returns the user's pages.
 *
 * @returns An array of Page objects.
 */
export function usePages(): Page[] {
  return usePagesStore().pages;
}

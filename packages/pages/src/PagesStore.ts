import { createObjectStore } from '@minddrop/stores';
import { Page } from './types';

export const PagesStore = createObjectStore<Page>('id');

/**
 * Retrieves a Page by ID or null if it doesn't exist.
 *
 * @param id - The ID of the page to retrieve.
 * @returns The page or null if it doesn't exist.
 */
export const usePage = (id: string): Page | null => {
  return PagesStore.useItem(id);
};

/**
 * Retrieves pages matching the given IDs.
 *
 * @param ids - The IDs of the pages to retrieve.
 * @returns An array of matching pages.
 */
export const usePages = (ids: string[]): Page[] => {
  return PagesStore.useItemsArray(ids);
};

/**
 * Retrieves all pages.
 *
 * @returns An array of all pages.
 */
export const useAllPages = (): Page[] => {
  return PagesStore.useAllItemsArray();
};

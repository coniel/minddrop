import { PagesStore } from '../PagesStore';
import { PageNotFoundError } from '../errors';
import { Page } from '../types';

/**
 * Retrieves a page from the store by ID.
 *
 * @param id - The ID of the page.
 * @param throwOnNotFound - Whether to throw an error if the page is not found.
 * @returns The page object.
 *
 * @throws {PageNotFoundError} If the page does not exist.
 */
export function getPage(id: string): Page;
export function getPage(id: string, throwOnNotFound: false): Page | null;
export function getPage(id: string, throwOnNotFound = true): Page | null {
  // Get the page from the store
  const page = PagesStore.get(id);

  // Throw an error if it doesn't exist, unless specified not to
  if (!page && throwOnNotFound) {
    throw new PageNotFoundError(id);
  } else if (!page && !throwOnNotFound) {
    return null;
  }

  return page;
}

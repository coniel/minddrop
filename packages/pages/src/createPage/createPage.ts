import { Events } from '@minddrop/events';
import { PagesStore } from '../PagesStore';
import { DefaultPageIcon } from '../constants';
import { createPageFile } from '../createPageFile';
import { Page } from '../types';

/**
 * Create a page and its associated markdown file.
 * Dispatches a 'pages:page:create' event.
 *
 * @param parentDir - The path to the parent directory.
 * @param title - The page title.
 * @param options - File creation options.
 * @param options.wrap - Whether the page should be wrapped in a directory of the same name.
 * @returns The new page.
 *
 * @throws {InvalidPathError} - The parent dir does not exist.
 * @throws {PathConflictError} - Page or wrapper dir already exists.
 */
export async function createPage(
  parentDir: string,
  title: string,
  options: { wrap?: boolean } = {},
): Promise<Page> {
  // Create page file
  const pageFilePath = await createPageFile(parentDir, title, options);

  // Create page object
  const page: Page = {
    title,
    path: pageFilePath,
    icon: DefaultPageIcon,
    wrapped: !!options.wrap,
  };

  // Add page to the store
  PagesStore.getState().add(page);

  // Dispatch 'pages:page:create' event
  Events.dispatch('pages:page:create', page);

  return page;
}

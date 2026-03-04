import { Events } from '@minddrop/events';
import { PagesStore } from '../PagesStore';
import { PageUpdatedEvent } from '../events';
import { getPage } from '../getPage';
import { Page, UpdatePageData } from '../types';
import { writePage } from '../writePage';

/**
 * Updates a page, updating it in the store and writing it to the
 * file system.
 *
 * @param pageId - The ID of the page to update.
 * @param data - The page data.
 * @returns The updated page.
 *
 * @dispatches 'pages:page:updated' event
 */
export async function updatePage(
  pageId: string,
  data: UpdatePageData,
): Promise<Page> {
  // Get the page
  const page = getPage(pageId);

  // Update the page
  const updatedPage: Page = {
    ...page,
    ...data,
    lastModified: new Date(),
  };

  // Update the page in the store
  PagesStore.update(pageId, { ...data, lastModified: new Date() });

  // Write the page config to the file system
  await writePage(pageId);

  // Dispatch the page updated event
  Events.dispatch(PageUpdatedEvent, {
    original: page,
    updated: updatedPage,
  });

  return updatedPage;
}

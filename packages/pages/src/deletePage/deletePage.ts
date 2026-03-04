import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { PagesStore } from '../PagesStore';
import { PageDeletedEvent, PageDeletedEventData } from '../events';
import { getPage } from '../getPage';
import { getPageFilePath } from '../utils';

/**
 * Deletes a page, removing it from the store and deleting it from the
 * file system.
 *
 * @param pageId - The ID of the page to delete.
 *
 * @dispatches pages:page:deleted
 */
export async function deletePage(pageId: string): Promise<void> {
  // Get the page
  const page = getPage(pageId);

  // Delete the page from the store
  PagesStore.remove(pageId);

  // Delete the page config from the file system
  await Fs.removeFile(getPageFilePath(pageId));

  // Dispatch the page deleted event
  Events.dispatch<PageDeletedEventData>(PageDeletedEvent, page);
}

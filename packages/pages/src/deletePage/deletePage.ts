import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { PageNotFoundError } from '../errors';
import { getPage } from '../getPage';
import { PagesStore } from '../PagesStore';
import { Events } from '@minddrop/events';
import { isWrapped } from '../utils';
import { removeChildPages } from '../removeChildPages';

/**
 * Deletes a page from the store and moves the page
 * file to system trash. If the page is wrapped, moves
 * the entire wrapper directory to system trash.
 *
 * Dispatches a 'pages:page:deleted' event.
 *
 * @param path - The path of the page to delete.
 *
 * @dispatches 'pages:page:deleted'
 */
export async function deletePage(path: string): Promise<void> {
  // If page is wrapped, delete the wrapper directory
  const pathToDelete = isWrapped(path) ? Fs.parentDirPath(path) : path;

  // Ensure that the page exists
  if (!getPage(path)) {
    throw new PageNotFoundError(path);
  }

  // Ensure that the page file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Remove the page from the store
  PagesStore.getState().remove(path);

  // If the page is wrapped, remove its children from the store
  if (isWrapped(path)) {
    removeChildPages(path);
  }

  // Move the page file to system trash
  await Fs.trashFile(pathToDelete);

  // Dispatch a 'pages:page:delete' event
  Events.dispatch('pages:page:delete', path);
}

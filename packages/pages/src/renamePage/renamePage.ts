import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  Fs,
  PathConflictError,
} from '@minddrop/file-system';
import { PagesStore } from '../PagesStore';
import { PageNotFoundError } from '../errors';
import { getPage } from '../getPage';
import { Page } from '../types';
import { isWrapped } from '../utils';

/**
 * Renames a page and its file. Dispatches a 'pages:page:rename' event.
 *
 * @param path - The path of the page to rename.
 * @param name - The new name of the page.
 * @returns The updated page.
 *
 * @dispatches 'pages:page:rename'
 */
export async function renamePage(path: string, name: string): Promise<Page> {
  // Get the page from the store
  const page = getPage(path);
  // The page file's parent dir
  const parentDir = Fs.parentDirPath(path);
  // Generate the new page path
  let newPath = `${Fs.parentDirPath(path)}/${name}.md`;

  // Ensure the page exists
  if (!page) {
    throw new PageNotFoundError(path);
  }

  // Ensure the page file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Ensure that there is not already a page with the same name
  if (await Fs.exists(newPath)) {
    throw new PathConflictError(path);
  }

  // Rename the page file
  await Fs.renameFile(path, newPath);

  // If the page is wrapped, rename the parent dir
  if (isWrapped(path)) {
    const newParentDir = Fs.concatPath(Fs.parentDirPath(parentDir), name);

    await Fs.renameFile(parentDir, newParentDir);

    // Include the new parent dir in the new path
    newPath = Fs.concatPath(newParentDir, Fs.fileNameFromPath(newPath));
  }

  // Generate the updated page object
  const updatedPage = {
    ...page,
    path: newPath,
    title: name,
  };

  // Remove the old version of the page from the store
  PagesStore.getState().remove(path);
  // Add the new verison of the page to the store
  PagesStore.getState().add(updatedPage);

  // Dispatch a 'pages:page:rename' event
  Events.dispatch('pages:page:rename', {
    oldPath: path,
    newPath,
  });

  return updatedPage;
}

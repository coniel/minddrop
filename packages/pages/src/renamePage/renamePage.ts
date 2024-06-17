import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  Fs,
  PathConflictError,
} from '@minddrop/file-system';
import { Markdown } from '@minddrop/markdown';
import { PagesStore } from '../PagesStore';
import { PageNotFoundError } from '../errors';
import { getPage } from '../getPage';
import { Page } from '../types';
import { isWrapped } from '../utils';
import { updateChildPagePaths } from '../updateChildPagePaths';
import { updatePageContent } from '../updatePageContent';

/**
 * Renames a page and its file.
 *
 * @param path The path of the page to rename.
 * @param name The new name of the page.
 * @returns The updated page.
 * @dispatches 'pages:page:renamed'
 *
 * @throws {PageNotFoundError} If the page does not exist.
 * @throws {FileNotFoundError} If the page file does not exist.
 * @throws {PathConflictError} If a page with the same name already exists.
 */
export async function renamePage(path: string, name: string): Promise<Page> {
  // Get the page from the store
  const page = getPage(path);
  // The path of the renamed page file
  const renamedFilePath = Fs.concatPath(Fs.parentDirPath(path), `${name}.md`);
  // The path of the renamed wrapper dir (only applicable if
  // the page is wrapped).
  const renamedWrapperDir = Fs.concatPath(Fs.pathSlice(path, 0, -2), name);
  // The new full path of the page
  const newPath = isWrapped(path)
    ? Fs.concatPath(renamedWrapperDir, `${name}.md`)
    : renamedFilePath;

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

  // Update the markdown heading to the new name
  const newContent = Markdown.updateHeading(page.contentRaw, name);

  // Generate the updated page object
  const updatedPage = {
    ...page,
    path: newPath,
    title: name,
    contentRaw: newContent,
  };

  // Update the page markdown with the new heading
  await updatePageContent(path, newContent);

  // Update the page in the store
  PagesStore.getState().update(path, updatedPage);

  // If the page is wrapped, recursively update its children's paths
  updateChildPagePaths(path, renamedWrapperDir);

  // Rename the page file
  await Fs.rename(path, renamedFilePath);

  // If the page is wrapped, rename the wrapper dir
  if (isWrapped(path)) {
    await Fs.rename(Fs.parentDirPath(path), renamedWrapperDir);
  }

  // Dispatch a 'pages:page:renamed' event
  Events.dispatch('pages:page:renamed', {
    oldPath: path,
    newPath,
  });

  return updatedPage;
}

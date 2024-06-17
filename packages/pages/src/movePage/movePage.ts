import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  Fs,
  InvalidPathError,
  PathConflictError,
} from '@minddrop/file-system';
import { PagesStore } from '../PagesStore';
import { PageNotFoundError } from '../errors';
import { getPage } from '../getPage';
import { updateChildPagePaths } from '../updateChildPagePaths';
import { titleFromPath } from '../utils';

/**
 * Moves a page to a new parent directory. If the page is wrapped, its children
 * will also be moved.
 *
 * @param path The path of the page to move.
 * @param newParentPath The path of the new parent directory.
 * @returns The new page path.
 *
 * @throws {PageNotFoundError} If the page does not exist.
 * @throws {FileNotFoundError} If the page file does not exist.
 * @throws {InvalidPathError} If the target parent directory does not exist or is not a directory.
 *
 */
export async function movePage(
  path: string,
  newParentPath: string,
): Promise<string> {
  // Get the page
  const page = getPage(path);
  // The path to move
  const pathToMove = page?.wrapped ? Fs.parentDirPath(path) : path;
  // The moved page's or wrapper dir's new path
  const movedPath = page?.wrapped
    ? Fs.concatPath(newParentPath, titleFromPath(path))
    : Fs.concatPath(newParentPath, Fs.fileNameFromPath(path));
  // The new page path
  const newPath = page?.wrapped
    ? Fs.concatPath(movedPath, Fs.fileNameFromPath(path))
    : movedPath;

  // Ensure that the page exists
  if (!page) {
    throw new PageNotFoundError(path);
  }

  // Ensure that the page path exists
  if (!(await Fs.exists(pathToMove))) {
    throw new FileNotFoundError(page.path);
  }

  // Ensure target parent dir exists
  if (!(await Fs.exists(newParentPath))) {
    throw new InvalidPathError(newParentPath);
  }

  // Ensure target parent dir is a directory
  if (!(await Fs.isDirectory(newParentPath))) {
    throw new InvalidPathError(newParentPath);
  }

  // Ensure that a child page with the same name does not exist
  // in the target parent dir.
  if (await Fs.exists(movedPath)) {
    throw new PathConflictError(movedPath);
  }

  // Move the page file/dir
  await Fs.rename(pathToMove, movedPath);

  // Update the page path in the store
  PagesStore.getState().update(page.path, {
    ...page,
    path: newPath,
  });

  // If the page is wrapped, recursively update its children's paths
  if (page.wrapped) {
    updateChildPagePaths(page.path, movedPath);
  }

  // Dispatch a 'pages:page:moved' event
  Events.dispatch('pages:page:moved', { from: path, to: newPath });

  return newPath;
}

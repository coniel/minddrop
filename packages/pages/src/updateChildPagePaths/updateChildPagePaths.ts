import { Fs } from '@minddrop/file-system';
import { PagesStore } from '../PagesStore';
import { getChildPages } from '../utils';

/**
 * Recursively updates the paths of the child pages of the
 * given parent path to the given new parent path.
 *
 * @param oldParentPath - The old parent path.
 * @param newParentPath - The new parent path.
 */
export function updateChildPagePaths(
  oldParentPath: string,
  newParentPath: string,
): void {
  // Get child pages from the old parent path
  const childPages = getChildPages(oldParentPath, PagesStore.getState().pages);

  // Recursively update the child pages' paths
  childPages.forEach((childPage) => {
    // The new child page path
    const newChildPagePath = Fs.concatPath(
      newParentPath,
      Fs.pathSlice(childPage.path, childPage.wrapped ? -2 : -1),
    );

    // Update the child page path in the store
    PagesStore.getState().update(childPage.path, {
      ...childPage,
      path: newChildPagePath,
    });

    // If the child page is wrapped, update its children's paths
    if (childPage.wrapped) {
      updateChildPagePaths(childPage.path, Fs.parentDirPath(newChildPagePath));
    }
  });
}

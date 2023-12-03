import { Fs } from '@minddrop/file-system';
import { Pages } from '@minddrop/pages';

/**
 * Moves a page to a new parent page or workspace.
 * If the destination is a page, the page will be wrapped
 * if it is not already wrapped.
 *
 * @param path The path of the page to move.
 * @param newParentPath The path of the new parent page or workspace.
 * @returns The new path of the page.
 *
 * @throws {PageNotFoundError} If the page does not exist.
 * @throws {FileNotFoundError} If the page file does not exist.
 * @throws {InvalidPathError} If the target parent page/workspace does not exist.
 */
export async function movePage(
  path: string,
  newParentPath: string,
): Promise<string> {
  let newParentDirPath = newParentPath;

  // Get the destination page (if it is one)
  const destinationPage = Pages.get(newParentPath);

  // If destination is an unwrapped page, wrap it
  if (destinationPage && !destinationPage.wrapped) {
    await Pages.wrap(newParentPath);
  }

  // Use the wrapper dir path as destination path if the
  // destination is a page.
  if (destinationPage) {
    newParentDirPath = Fs.parentDirPath(Pages.getWrappedPath(newParentPath));
  }

  // Move the page
  return Pages.move(path, newParentDirPath);
}

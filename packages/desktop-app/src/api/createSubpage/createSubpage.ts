import { Page, Pages } from '@minddrop/pages';
import { createPage } from '../createPage';
import { Fs } from '@minddrop/file-system';

/**
 * Creates a new "Untitled" page and its asscoitated markdown file
 * as a subpage of an existing page.
 *
 * @param parentPagePath - Path of the parent page.
 * @returns The newly created page.
 */
export async function createSubpage(parentPagePath: string): Promise<Page> {
  let wrappedParentPagePath = parentPagePath;

  // Wrap the page if it is not already wrapped
  if (!Pages.isWrapped(parentPagePath)) {
    wrappedParentPagePath = await Pages.wrap(parentPagePath);
  }

  // Create a new page inside parent page wrapper dir
  return createPage(Fs.parentDirPath(wrappedParentPagePath));
}

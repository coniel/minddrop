import { i18n } from '@minddrop/i18n';
import { Page, Pages } from '@minddrop/pages';
import { Fs } from '@minddrop/file-system';

/**
 * Creates a new "Untitled" page and its associated markdown file
 * in the specified parent directory.
 *
 * @param parentPath - The path to the parent directory.
 * @returns The newly created page.
 */
export async function createPage(parentPath: string): Promise<Page> {
  // Use 'Untitled' as the default page title
  let title = i18n.t('pages.untitled');

  const { increment } = await Fs.incrementalPath(
    Fs.concatPath(parentPath, `${title}.md`),
  );

  if (increment) {
    title = `${title} ${increment}`;
  }

  return await Pages.create(parentPath, title);
}

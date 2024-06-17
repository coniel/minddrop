import { getPageMetadata, serializePageMetadata } from '../utils';
import { getPage } from '../getPage';
import { PageNotFoundError } from '../errors';
import { writePage } from '../writePage';
import { PagesStore } from '../PagesStore';
import { Events } from '@minddrop/events';

/**
 * Updates a page's markdown content in the store and writes it
 * to the page file.
 *
 * @param path - The path to the page's markdown file.
 * @param content - The content to write to the page's markdown file.
 *
 * @throws {PageNotFoundError} - If the page does not exist.
 * @throws {FileNotFoundError} - If the page's markdown file does not exist.
 * @dispatches 'pages:page:update-content'
 */
export async function updatePageContent(
  path: string,
  content: string,
): Promise<void> {
  const page = getPage(path);

  // Ensure the page exists.
  if (!page) {
    throw new PageNotFoundError(path);
  }

  // Generate the page's front matter
  const frontMatter = serializePageMetadata(getPageMetadata(page));

  // Update the page's raw content in the store
  PagesStore.getState().update(path, { contentRaw: content });

  // Write the page's content, including front matter,
  // to the markdown file.
  writePage(path, `${frontMatter}${content}`);

  // Dispatch a 'pages:page:update-content' event
  Events.dispatch('pages:page:update-content', path);
}

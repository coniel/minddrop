import { getPageMetadata, serializePageMetadata } from '../utils';
import { getPage } from '../getPage';
import { PageNotFoundError } from '../errors';
import { writePage } from '../writePage';

/**
 * Writes a page's markdown content to the page file.
 *
 * @param path - The path to the page's markdown file.
 * @param content - The content to write to the page's markdown file.
 *
 * @throws {PageNotFoundError} - If the page does not exist.
 * @throws {FileNotFoundError} - If the page's markdown file does not exist.
 */
export async function writePageContent(
  path: string,
  content: string,
): Promise<void> {
  const page = getPage(path);

  // Ensure the page exists.
  if (!page) {
    throw new PageNotFoundError(path);
  }

  // Generate the page's front matter.
  const frontMatter = serializePageMetadata(getPageMetadata(page));

  // Write the page's content, including front matter,
  // to the markdown file.
  writePage(path, `${frontMatter}${content}`);
}

import { FileNotFoundError, Fs } from '@minddrop/file-system';
import {
  getPageMetadata,
  removePageMetadata,
  serializePageMetadata,
} from '../utils';
import { getPage } from '../getPage';
import { writePage } from '../writePage/writePage';
import { PageNotFoundError } from '../errors';

/**
 * Writes the relevant values from the current page state
 * to its metadata in the markdown file.
 *
 * @param path - The page path.
 *
 * @throws {InvalidParameterError} - Page does not exist.
 * @throws {InvalidPathError} - Page file does not exist.
 */
export async function writePageMetadata(path: string): Promise<void> {
  const page = getPage(path);

  // Ensure page exists
  if (!page) {
    throw new PageNotFoundError(path);
  }

  // Ensure page file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Get the current page content
  const pageContent = await Fs.readTextFile(path);
  // Remove the metadata from the page content
  // to get just the text content.
  const pureContent = removePageMetadata(pageContent);

  // Generate the new page metadata from the
  // current page state.
  const newMetadata = getPageMetadata(page);

  // Serialize the new page metadata
  const serializedMetadata = serializePageMetadata(newMetadata);

  // Combine new serialized metadata and page
  // text content.
  const markdown = `${serializedMetadata}${pureContent}`;

  // Write the updated file contents
  writePage(path, markdown);
}

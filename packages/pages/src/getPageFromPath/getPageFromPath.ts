import { Fs } from '@minddrop/file-system';
import { Page } from '../types';
import { deserializePageMetadata, isWrapped, titleFromPath } from '../utils';

/**
 * Create a page object from a markdown file.
 *
 * @param path - The page markdown file path.
 */
export async function getPageFromPath(path: string): Promise<Page> {
  // Get the markdown file contents
  const pageContent = await Fs.readTextFile(path);

  // Get the page metadata
  const metadata = deserializePageMetadata(pageContent);

  // Create a page object
  return {
    path,
    title: titleFromPath(path),
    wrapped: isWrapped(path),
    icon: metadata.icon,
  };
}

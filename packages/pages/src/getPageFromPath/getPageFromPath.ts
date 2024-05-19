import { Fs } from '@minddrop/file-system';
import { Markdown } from '@minddrop/markdown';
import { Page } from '../types';
import { deserializePageMetadata, isWrapped, titleFromPath } from '../utils';

/**
 * Create a page object from a markdown file.
 *
 * @param path - The page markdown file path.
 * @returns A page object.
 */
export async function getPageFromPath(path: string): Promise<Page> {
  // Get the page file contents
  const pageContent = await Fs.readTextFile(path);
  // Get the page metadata
  const metadata = deserializePageMetadata(pageContent);
  // Get the markdown content
  const markdown = Markdown.getContent(pageContent);

  // Create a page object
  return {
    path,
    title: titleFromPath(path),
    wrapped: isWrapped(path),
    icon: metadata.icon,
    contentRaw: markdown,
    contentParsed: null,
  };
}

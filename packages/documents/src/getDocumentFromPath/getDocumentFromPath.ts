import { Fs } from '@minddrop/file-system';
import { Markdown } from '@minddrop/markdown';
import { Document } from '../types';
import { deserializeDocumentMetadata, isWrapped, titleFromPath } from '../utils';

/**
 * Create a document object from a markdown file.
 *
 * @param path - The document markdown file path.
 * @returns A document object.
 */
export async function getDocumentFromPath(path: string): Promise<Document> {
  // Get the document file contents
  const documentContent = await Fs.readTextFile(path);
  // Get the document metadata
  const metadata = deserializeDocumentMetadata(documentContent);
  // Get the markdown content
  const markdown = Markdown.getContent(documentContent);

  // Create a document object
  return {
    path,
    title: titleFromPath(path),
    wrapped: isWrapped(path),
    icon: metadata.icon,
    contentRaw: markdown,
    contentParsed: null,
  };
}

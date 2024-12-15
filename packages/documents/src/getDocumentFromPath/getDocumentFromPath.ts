import { Block, Blocks } from '@minddrop/blocks';
import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { parseDateOrNow } from '@minddrop/utils';
import { DocumentParseError } from '../errors';
import { DeserializedDocumentData, Document, DocumentView } from '../types';
import { isWrapped } from '../utils';

/**
 * Reads and parses a document file from the specified path.
 *
 * Returns an object containing the document object, as well as
 * the document's views and blocks.
 *
 * @param path - The document file path.
 * @returns The document object, views, and blocks.
 *
 * @throws {DocumentParseError} - The document file could not be parsed.
 */
export async function getDocumentFromPath(path: string): Promise<{
  document: Document;
  views: DocumentView[];
  blocks: Block[];
}> {
  let parsedDocument: DeserializedDocumentData;
  let fileTextContent: string;

  // Attempt to read the file's text content
  try {
    fileTextContent = await Fs.readTextFile(path);
  } catch (error) {
    console.error(error);
    throw new FileNotFoundError(path);
  }

  // Attempt to parse the document file's text content
  try {
    parsedDocument = JSON.parse(fileTextContent);
  } catch (error) {
    console.error(error);
    throw new DocumentParseError(path);
  }

  return {
    document: {
      ...parsedDocument,
      path,
      // Use the file name as the document title
      title: Fs.fileNameFromPath(path).split('.')[0],
      // Parse date strings into Date objects
      created: parseDateOrNow(parsedDocument.created),
      lastModified: parseDateOrNow(parsedDocument.lastModified),
      // Mark the document as wrapped if it is located in a wrapper directory
      wrapped: isWrapped(path),
      // Replace the views and blocks with their IDs
      views: parsedDocument.views.map((view) => view.id),
      blocks: parsedDocument.blocks.map((block) => block.id) as string[],
    },
    views: parsedDocument.views,
    blocks: parsedDocument.blocks.map((block) => Blocks.parse(block)),
  };
}

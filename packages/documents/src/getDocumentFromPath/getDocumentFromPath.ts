import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { Document, JsonParsedDocumentData } from '../types';
import { DocumentParseError } from '../errors';
import { isWrapped } from '../utils';

/**
 * Create a document object from a document file.
 *
 * @param path - The document file path.
 * @returns A document object.
 *
 * @throws {DocumentParseError} - The document file could not be parsed.
 */
export async function getDocumentFromPath(path: string): Promise<Document> {
  let parsedDocument: JsonParsedDocumentData;
  let fileTextContent: string;

  // Attempt to read the file's text content
  try {
    fileTextContent = await Fs.readTextFile(path);
  } catch (error) {
    throw new FileNotFoundError(path);
  }

  // Attempt to parse the document file's text content
  try {
    parsedDocument = JSON.parse(fileTextContent);
  } catch (error) {
    throw new DocumentParseError(path);
  }

  return {
    ...parsedDocument,
    path,
    // Use the file name as the document title
    title: Fs.fileNameFromPath(path).split('.')[0],
    // Parse date strings into Date objects
    created: new Date(parsedDocument.created),
    lastModified: new Date(parsedDocument.lastModified),
    // Mark the document as wrapped if it is located in a wrapper directory
    wrapped: isWrapped(path),
  };
}

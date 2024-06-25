import { Fs } from '@minddrop/file-system';
import { Document } from '../types';
import { isWrapped, titleFromPath } from '../utils';
import { getDocumentTypeConfig } from '../DocumentTypeConfigsStore';
import { DefaultDocumentProperties } from '../constants';

/**
 * Create a document object from a document file.
 *
 * @param path - The document file path.
 * @returns A document object.
 */
export async function getDocumentFromPath(path: string): Promise<Document> {
  // Get the document type configuration
  const config = getDocumentTypeConfig(Fs.getExtension(path));
  // Get the document file's text content
  const fileTextContent = await Fs.readTextFile(path);
  // Parse the document properties
  const properties = config.parseProperties(fileTextContent);

  // Create a document object
  return {
    path,
    fileType: Fs.getExtension(path),
    title: titleFromPath(path),
    wrapped: isWrapped(path),
    properties: {
      ...DefaultDocumentProperties,
      ...properties,
    },
    fileTextContent,
    // Content is parsed when the document is opened
    content: null,
  };
}

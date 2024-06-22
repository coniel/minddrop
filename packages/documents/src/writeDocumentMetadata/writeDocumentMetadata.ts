import { FileNotFoundError, Fs } from '@minddrop/file-system';
import {
  getDocumentMetadata,
  removeDocumentMetadata,
  serializeDocumentMetadata,
} from '../utils';
import { getDocument } from '../getDocument';
import { writeDocument } from '../writeDocument/writeDocument';
import { DocumentNotFoundError } from '../errors';

/**
 * Writes the relevant values from the current document state
 * to its metadata in the markdown file.
 *
 * @param path - The document path.
 *
 * @throws {InvalidParameterError} - Document does not exist.
 * @throws {InvalidPathError} - Document file does not exist.
 */
export async function writeDocumentMetadata(path: string): Promise<void> {
  const document = getDocument(path);

  // Ensure document exists
  if (!document) {
    throw new DocumentNotFoundError(path);
  }

  // Ensure document file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Get the current document content
  const documentContent = await Fs.readTextFile(path);
  // Remove the metadata from the document content
  // to get just the text content.
  const pureContent = removeDocumentMetadata(documentContent);

  // Generate the new document metadata from the
  // current document state.
  const newMetadata = getDocumentMetadata(document);

  // Serialize the new document metadata
  const serializedMetadata = serializeDocumentMetadata(newMetadata);

  // Combine new serialized metadata and document
  // text content.
  const markdown = `${serializedMetadata}${pureContent}`;

  // Write the updated file contents
  writeDocument(path, markdown);
}

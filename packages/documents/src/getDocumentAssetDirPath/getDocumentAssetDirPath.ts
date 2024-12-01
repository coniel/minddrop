import { Fs } from '@minddrop/file-system';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument/getDocument';

/**
 * Returns the nearest assets directory path to the given document.
 *
 * @param documentId - The ID of the document for which to get the asset dir path.
 * @returns The asset dir path.
 *
 * @throws {DocumentNotFoundError} Thrown if the document does not exist.
 * @throws {DocumentFileNotFoundError} Thrown if the document file does not exist.
 */
export function getDocumentAssetDirPath(documentId: string): string {
  // Get the document
  const document = getDocument(documentId);

  // Ensure the document exists
  if (!document) {
    throw new DocumentNotFoundError(documentId);
  }

  // Return the path to the assets directory in the document's parent directory.
  return Fs.concatPath(Fs.parentDirPath(document.path), '.minddrop', 'assets');
}

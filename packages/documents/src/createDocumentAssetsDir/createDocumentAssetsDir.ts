import { Fs } from '@minddrop/file-system';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';

/**
 * Creates the assets directory for the given document. If the assets directory
 * already exists, it is not recreated.
 *
 * If the document is wrapped, the assets directoru is created in the
 * wrapper directory. Otherwise, it is created in the parent/workspace
 * directory.
 *
 * @param documentId - The ID of the document for which to create the assets directory.
 * @returns The path to the created assets directory.
 */
export async function createDocumentAssetsDir(
  documentId: string,
): Promise<string> {
  // Get the document
  const document = getDocument(documentId);

  // Ensure the document exists
  if (!document) {
    throw new DocumentNotFoundError(documentId);
  }

  // The document's parent directory, either its wrapper dir
  // or parent document/workspace dir.
  const parentDir = Fs.parentDirPath(document.path);

  // If the parent dir does not contain a .minddrop directory, create it
  if (!(await Fs.exists(Fs.concatPath(parentDir, '.minddrop')))) {
    await Fs.createDir(Fs.concatPath(parentDir, '.minddrop'));
  }

  // Path to the assets directory
  const assetsDir = Fs.concatPath(parentDir, '.minddrop', 'assets');

  // IF the assets directory does not exist, create
  if (!(await Fs.exists(assetsDir))) {
    await Fs.createDir(assetsDir);
  }

  return assetsDir;
}

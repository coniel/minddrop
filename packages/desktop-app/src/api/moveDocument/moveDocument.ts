import { Documents } from '@minddrop/documents';
import { Fs } from '@minddrop/file-system';

/**
 * Moves a document to a new parent document or workspace.
 * If the destination is a document, the document will be wrapped
 * if it is not already wrapped.
 *
 * @param id - The path of the document to move.
 * @param newParentPath - The path of the new parent document or workspace.
 * @returns The new path of the document.
 *
 * @throws {DocumentNotFoundError} If the document does not exist.
 * @throws {FileNotFoundError} If the document file does not exist.
 * @throws {InvalidPathError} If the target parent document/workspace does not exist.
 */
export async function moveDocument(
  id: string,
  newParentPath: string,
): Promise<string> {
  let newParentDirPath = newParentPath;

  // Get the destination document (if it is one)
  const destinationDocument = Documents.getByPath(newParentPath);

  // If destination is an unwrapped document, wrap it
  if (destinationDocument && !destinationDocument.wrapped) {
    await Documents.wrap(destinationDocument.id);
  }

  // Use the wrapper dir path as destination path if the
  // destination is a document.
  if (destinationDocument) {
    newParentDirPath = Fs.parentDirPath(
      Documents.getWrappedPath(newParentPath),
    );
  }

  // Move the document
  return Documents.move(id, newParentDirPath);
}

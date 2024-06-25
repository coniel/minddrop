import { Fs } from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';
import { getChildDocuments } from '../utils';

/**
 * Recursively updates the paths of the child documents of the
 * given parent path to the given new parent path.
 *
 * @param oldParentPath - The old parent path.
 * @param newParentPath - The new parent path.
 */
export function updateChildDocumentPaths(
  oldParentPath: string,
  newParentPath: string,
): void {
  // Get child documents from the old parent path
  const childDocuments = getChildDocuments(
    oldParentPath,
    DocumentsStore.getState().documents,
  );

  // Recursively update the child documents' paths
  childDocuments.forEach((childDocument) => {
    // Replace the old parent path with the new parent path
    const newChildDocumentPath = Fs.concatPath(
      newParentPath,
      Fs.pathSlice(childDocument.path, childDocument.wrapped ? -2 : -1),
    );

    // Update the child document path in the store
    DocumentsStore.getState().update(childDocument.path, {
      ...childDocument,
      path: newChildDocumentPath,
    });

    // If the child document is wrapped, update its children's paths
    if (childDocument.wrapped) {
      updateChildDocumentPaths(
        childDocument.path,
        Fs.parentDirPath(newChildDocumentPath),
      );
    }
  });
}

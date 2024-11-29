import { Fs } from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';
import { getChildDocuments, isDocumentFile } from '../utils';

/**
 * Recursively updates the paths documents to reflect the
 * new parent path.
 *
 * @param oldParentPath - The old parent document path.
 * @param newParentPath - The new parent document path.
 */
export function updateChildDocumentPaths(
  oldParentPath: string,
  newParentPath: string,
): void {
  // Get the directory path of the new parent path
  const newDirPath = isDocumentFile(newParentPath)
    ? Fs.parentDirPath(newParentPath)
    : newParentPath;

  // Get the child documents of the old parent path
  const childDocuments = getChildDocuments(oldParentPath);

  // Recursively update the child documents' paths
  childDocuments.forEach((child) => {
    // Replace the old parent path with the new parent path
    const newChildDocumentPath = Fs.concatPath(
      newDirPath,
      Fs.pathSlice(child.path, child.wrapped ? -2 : -1),
    );

    // Update the child document path in the store
    DocumentsStore.getState().update(child.id, {
      path: newChildDocumentPath,
    });

    // If the child document is wrapped, update its children's paths
    if (child.wrapped) {
      updateChildDocumentPaths(child.path, newChildDocumentPath);
    }
  });
}

import { DocumentsStore } from '../DocumentsStore';
import { getChildDocuments } from '../utils';

/**
 * Recursively removes all child documents of the given parent path.
 *
 * @param parentPath - The path of the parent
 */
export function removeChildDocuments(parentPath: string): void {
  // Get the child documents
  const childDocuments = getChildDocuments(parentPath, DocumentsStore.getState().documents);

  // Remove each child document and its own child documents
  // if it has any.
  childDocuments.forEach((document) => {
    DocumentsStore.getState().remove(document.path);
    removeChildDocuments(document.path);
  });
}

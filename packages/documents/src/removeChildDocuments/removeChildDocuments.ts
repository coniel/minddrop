import { DocumentsStore } from '../DocumentsStore';
import { getChildDocuments } from '../utils';

/**
 * Recursively removes all child documents of the specified parent document.
 *
 * @param path - The path of the parent document.
 */
export function removeChildDocuments(path: string): void {
  const children = getChildDocuments(path);

  children.forEach((child) => {
    if (child) {
      DocumentsStore.getState().remove(child.id);
      removeChildDocuments(child.path);
    }
  });
}

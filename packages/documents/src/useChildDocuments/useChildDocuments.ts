import { DocumentsStore as useDocumentsStore } from '../DocumentsStore';
import { Document } from '../types';
import { getChildDocuments } from '../utils';

/**
 * Returns a list of documents which are direct children of
 * the specified path.
 *
 * @param path - The parent path.
 * @returns An array of child documents.
 */
export function useChildDocuments(path: string): Document[] {
  // Get all documents
  const { documents } = useDocumentsStore();

  // Get child documents sorted by title in alphabetical order
  return getChildDocuments(path, documents).sort((a, b) =>
    a.title > b.title ? 1 : -1,
  );
}

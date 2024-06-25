import { Document } from '../../types';
import { isDocumentFile, isWrapped } from '../../utils';

/**
 * Returns a path's direct child documents from the given
 * list of documents.
 *
 * @param path - The root path from which to get the children.
 * @param documents - The documents from which to match.
 * @returns An array of documents.
 */
export function getChildDocuments(
  path: string,
  documents: Document[],
): Document[] {
  let rootPathParts = path.split('/');

  if (isDocumentFile(path)) {
    // Only wrapped documents can contain children
    if (!isWrapped(path)) {
      return [];
    }

    // If the path is a wrapped use the wrapper dir as
    // the root path.
    rootPathParts = rootPathParts.slice(0, -1);
  }

  const rootPath = rootPathParts.join('/');

  return (
    documents
      // Filter out the document itself
      .filter((document) => document.path !== path)
      // Filter out documents which are not descendants
      .filter((document) => document.path.startsWith(rootPath))
      .filter((document) => {
        const documentPathLength = document.path.split('/').length;

        return (
          // Document is a file inside parent dir
          documentPathLength === rootPathParts.length + 1 ||
          // Document is one level deeper in a dir which is a wrapper for it
          (documentPathLength === rootPathParts.length + 2 &&
            isWrapped(document.path))
        );
      })
  );
}

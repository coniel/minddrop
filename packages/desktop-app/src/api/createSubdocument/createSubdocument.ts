import {
  Document,
  DocumentNotFoundError,
  Documents,
} from '@minddrop/documents';
import { Fs } from '@minddrop/file-system';
import { createDocument } from '../createDocument';

/**
 * Creates a new "Untitled" document and its asscoitated file
 * as a subdocument of an existing document.
 *
 * @param parentId - ID of the parent document.
 * @returns The newly created document.
 */
export async function createSubdocument(parentId: string): Promise<Document> {
  const parentDocument = Documents.get(parentId);

  if (!parentDocument) {
    throw new DocumentNotFoundError(parentId);
  }

  let parentPath = parentDocument.path;

  // Wrap the document if it is not already wrapped
  if (!parentDocument.wrapped) {
    parentPath = await Documents.wrap(parentId);
  }

  // Create a new document inside parent document wrapper dir
  return createDocument(Fs.parentDirPath(parentPath));
}

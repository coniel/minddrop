import { Document, Documents } from '@minddrop/documents';
import { createDocument } from '../createDocument';
import { Fs } from '@minddrop/file-system';

/**
 * Creates a new "Untitled" document and its asscoitated markdown file
 * as a subdocument of an existing document.
 *
 * @param parentDocumentPath - Path of the parent document.
 * @returns The newly created document.
 */
export async function createSubdocument(parentDocumentPath: string): Promise<Document> {
  let wrappedParentDocumentPath = parentDocumentPath;

  // Wrap the document if it is not already wrapped
  if (!Documents.isWrapped(parentDocumentPath)) {
    wrappedParentDocumentPath = await Documents.wrap(parentDocumentPath);
  }

  // Create a new document inside parent document wrapper dir
  return createDocument(Fs.parentDirPath(wrappedParentDocumentPath));
}

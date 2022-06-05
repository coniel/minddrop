import { RichTextElements } from './RichTextElements';
import { RTDocumentsResource } from './RTDocumentsResource';
import { toPlainText } from './toPlainText';
import { RTDocumentsApi } from './types/RTDocumentsApi.types';

export const RichTextDocuments: RTDocumentsApi = {
  ...RTDocumentsResource,
  toPlainText: (document) => {
    // Get the document's children
    const children = RichTextElements.get(document.children);

    // Turn the children map into an array ordered according
    // to the order of the document's children
    const orderedChildren = document.children.map(
      (childId) => children[childId],
    );

    // Return the children as plain text
    return toPlainText(orderedChildren);
  },
  addEventListener: (core, type, callback) =>
    core.addEventListener(type, callback),
  removeEventListener: (core, type, callback) =>
    core.addEventListener(type, callback),
};

/**
 * Returns a rich text document by ID.
 *
 * @param documentId - The ID of the rich text document to retrieve.
 * @returns A rich text document or `null` if it does not exist.
 */
export const useRichTextDocument = RTDocumentsResource.hooks.useDocument;

/**
 * Returns rich text documents by ID.
 *
 * @param documentIds - The IDs of the rich text documents to retrieve.
 * @returns A `{ [id]: RTDocument }` map of rich text documents.
 */
export const useRichTextDocuments = RTDocumentsResource.hooks.useDocuments;

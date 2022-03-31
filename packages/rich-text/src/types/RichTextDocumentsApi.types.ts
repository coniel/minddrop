import {
  RichTextDocument,
  RichTextDocumentMap,
} from './RichTextDocument.types';

export interface RichTextDocumentsApi {
  /**
   * Retrieves rich text documents by ID. If provided a single ID string,
   * returns the matching rich text document. If provided an array of IDs,
   * returns a `{ [id]: RichTextDocument }` map of the corresponding rich
   * text documents.
   *
   * - Throws a `RichTextDocumentNotFoundError` if a requested document
   *   does not exist.
   *
   * @param documentId The ID(s) of the document(s) to retrieve.
   * @rturns The requested document or `{ [id]: RichTextDocument }` map of the requested rich text documents.
   */
  get(documentId: string | string[]): RichTextDocument | RichTextDocumentMap;

  /**
   * Converts a rich text document to a plain text string.
   * Void documentsare converted using their toPlainText method.
   * If they do not have such a method, they are omited.
   *
   * - Throws a RichTextDocumentNotFoundError if any of the
   *   document's rich text documents do no exist.
   *
   * @param document The rich text document.
   * @returns The plain text.
   */
  toPlainText(document: RichTextDocument): string;
}

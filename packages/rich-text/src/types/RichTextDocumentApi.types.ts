import { RichTextDocument } from './RichTextDocument.types';

export interface RichTextDocumentApi {
  /**
   * Returns the text contents of a rich text documents
   * as a plain text string. Adds a line break between
   * the text of block elements.
   *
   * @param document The rich text document.
   * @returns The plain text.
   */
  toPlainText(document: RichTextDocument): string;
}

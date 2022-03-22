import { RichTextContent, RichTextDocument } from './RichTextDocument.types';

export interface RichTextApi {
  /**
   * Generates a new rich text document with the
   * given content.
   *
   * @param content The content of the rich text document.
   * @returns A new rich text document.
   */
  generateDocument(content: RichTextContent): RichTextDocument;

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

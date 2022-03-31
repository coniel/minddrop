import { RichTextDocument } from './RichTextDocument.types';

export interface RichTextDocumentsApi {
  /**
   * Converts a rich text document to a plain text string.
   * Void elementsare converted using their toPlainText method.
   * If they do not have such a method, they are omited.
   *
   * - Throws a RichTextElementNotFoundError if any of the
   *   document's rich text elements do no exist.
   *
   * @param document The rich text document.
   * @returns The plain text.
   */
  toPlainText(document: RichTextDocument): string;
}

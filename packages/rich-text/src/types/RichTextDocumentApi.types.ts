import { RichTextElement } from './RichTextElement.types';

export interface RichTextDocumentApi {
  /**
   * Converts rich text elements into a plain text string.
   *
   * @param document The rich text document.
   * @returns The plain text.
   */
  toPlainText(elements: RichTextElement[]): string;
}

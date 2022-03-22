import { Node } from 'slate';
import { RichTextDocument } from '../types';

/**
 * Returns the text contents of a rich text documents
 * as a plain text string. Adds a line break between
 * the text of block elements.
 *
 * @param document The rich text document.
 * @returns The plain text.
 */
export function toPlainText(document: RichTextDocument): string {
  return document.content.map((node) => Node.string(node)).join('\n\n');
}

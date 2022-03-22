import { generateId } from '@minddrop/utils';
import { RichTextContent, RichTextDocument } from '../types';

/**
 * Generates a new rich text document with the
 * given content.
 *
 * @param content The content of the rich text document.
 * @returns A new rich text document.
 */
export function generateRichTextDocument(
  content: RichTextContent,
): RichTextDocument {
  return {
    revision: generateId(),
    content,
  };
}

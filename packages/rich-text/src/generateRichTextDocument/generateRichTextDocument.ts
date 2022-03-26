import { generateId } from '@minddrop/utils';
import { RichTextDocument } from '../types';

/**
 * Generates a new rich text document with the
 * given content.
 *
 * @param children The content of the rich text document.
 * @returns A new rich text document.
 */
export function generateRichTextDocument(
  children: string[] = [],
): RichTextDocument {
  return {
    id: generateId(),
    revision: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    parents: [],
    children,
  };
}

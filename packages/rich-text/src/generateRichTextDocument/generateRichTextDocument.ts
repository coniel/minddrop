import { generateId } from '@minddrop/utils';
import { CreateRichTextDocumentData, RichTextDocument } from '../types';

/**
 * Generates a new rich text document with the given data.
 *
 * @param data The document data.
 * @returns A new rich text document.
 */
export function generateRichTextDocument(
  data?: CreateRichTextDocumentData,
): RichTextDocument {
  return {
    id: generateId(),
    revision: generateId(),
    children: [],
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    parents: [],
  };
}

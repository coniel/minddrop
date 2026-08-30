import { Element } from '@minddrop/ast';
import { Editor } from '../types';
import { assignBlockIds } from '../withBlockIds';
import { createTestEditor } from './createTestEditor';

/**
 * Creates an editor whose blocks carry block IDs, which the app's
 * selection identifies them by.
 *
 * @param content - The editor's content.
 * @returns The editor.
 */
export function createTestEditorWithBlockIds(content: Element[]): Editor {
  return createTestEditor(assignBlockIds(content));
}

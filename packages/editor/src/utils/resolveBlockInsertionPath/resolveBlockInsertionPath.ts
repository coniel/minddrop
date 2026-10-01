import { Path, Editor as SlateEditor, Element as SlateElement } from 'slate';
import { Element } from '@minddrop/ast';
import { Editor } from '../../types';
import { isBlockElement } from '../isBlockElement';

/**
 * Resolves the path a new block goes at: below the block the cursor
 * is in, or at the end of the document without a cursor.
 *
 * @param editor - An editor instance.
 * @returns The path to insert the block at.
 */
export function resolveBlockInsertionPath(editor: Editor): Path {
  // Find the block the cursor is in
  const entry = editor.selection
    ? SlateEditor.above<Element>(editor, {
        match: (node) =>
          SlateElement.isElement(node) &&
          isBlockElement((node as Element).type),
      })
    : undefined;

  // Check if the cursor is in a block. If not, the block goes at the
  // end of the document.
  if (!entry) {
    return [editor.children.length];
  }

  // Return the path below the block
  return Path.next(entry[1]);
}

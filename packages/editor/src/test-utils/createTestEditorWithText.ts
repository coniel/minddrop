import { Editor as SlateEditor, Transforms } from 'slate';
import { Editor } from '../types';
import { createTestEditor } from './createTestEditor';
import { paragraphElement1 } from './editor.fixtures';

/**
 * Creates an editor holding a single block with the cursor at its end.
 *
 * @param text - The block's text.
 * @returns The editor.
 */
export function createTestEditorWithText(text = ''): Editor {
  // Create an editor holding a single block with the given text
  const editor = createTestEditor([
    { ...paragraphElement1, children: [{ text }] },
  ]);

  // Place the cursor at the end of the block's text
  Transforms.select(editor, SlateEditor.end(editor, [0]));

  return editor;
}

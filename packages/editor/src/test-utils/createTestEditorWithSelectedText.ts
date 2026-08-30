import { Editor as SlateEditor, Transforms } from 'slate';
import { Editor } from '../types';
import { createTestEditor } from './createTestEditor';
import { paragraphElement1 } from './editor.fixtures';

/**
 * Creates an editor holding a single block with its text selected.
 *
 * @param text - The block's text.
 * @returns The editor.
 */
export function createTestEditorWithSelectedText(text: string): Editor {
  // Create an editor holding a single block with the given text
  const editor = createTestEditor([
    { ...paragraphElement1, children: [{ text }] },
  ]);

  // Select the block's entire text
  Transforms.select(editor, {
    anchor: SlateEditor.start(editor, [0]),
    focus: SlateEditor.end(editor, [0]),
  });

  return editor;
}

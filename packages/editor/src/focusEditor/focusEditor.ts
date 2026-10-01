import { ReactEditor } from 'slate-react';
import { Editor } from '../types';

/**
 * Focuses an editor's editable area. Does nothing for an editor
 * which is not rendered.
 *
 * @param editor - An editor instance.
 */
export function focusEditor(editor: Editor): void {
  // Check the editor has an editable area. slate-react reports a
  // missing one by throwing.
  try {
    ReactEditor.toDOMNode(editor, editor);
  } catch {
    return;
  }

  // Focus the editable area
  ReactEditor.focus(editor);
}

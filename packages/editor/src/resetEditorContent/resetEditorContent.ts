import { HistoryEditor } from 'slate-history';
import { Element } from '@minddrop/ast';
import { Editor } from '../types';

/**
 * Replaces the editor's content in place, keeping the title node when the
 * editor has one. The selection and the history are cleared, since neither
 * refers to anything in the new content.
 *
 * Applied outside of the operation pipeline so that the replacement is not
 * itself undoable and does not invalidate anything block by block.
 *
 * @param editor - The editor.
 * @param content - The new content, excluding the title node.
 * @param hasTitle - Whether the editor's first node is its title.
 */
export function resetEditorContent(
  editor: Editor,
  content: Element[],
  hasTitle: boolean,
): void {
  // Keep the title node, if there is one
  const title = hasTitle ? editor.children.slice(0, 1) : [];

  // Replace the content and clear the selection, which points into
  // the old content.
  editor.children = [...title, ...content];
  editor.selection = null;

  // Clear the history, which also points into the old content
  if (HistoryEditor.isHistoryEditor(editor)) {
    editor.history = { undos: [], redos: [] };
  }

  // Notify the editor of the change so that it re-renders
  editor.onChange();
}

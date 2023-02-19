import { RichTextElements } from '@minddrop/rich-text';
import {
  createEditor as createSlateEditor,
  Editor as SlateEditor,
} from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { Editor } from '../../types';

/**
 * Creates a new editor configured with the React and History
 * plugins, as well as support for `RTElement`s.
 *
 * @param documentId The ID of the rich text document being edited.
 * @returns An editor instance.
 */
export function createEditor(): Editor {
  // Create a Slate editor with the React and history plugins
  const editor = withReact(
    withHistory(createSlateEditor()),
  ) as unknown as Editor;

  // Checks if an element is an inline level element
  editor.isInline = (element) => {
    // Get the element's configuration object
    const config = RichTextElements.getTypeConfig(element.type);

    // Return `true` if the element is configured an inline level
    return config.level === 'inline';
  };

  // Checks if an element is a void
  editor.isVoid = (element) => {
    // Get the element's configuration object
    const config = RichTextElements.getTypeConfig(element.type);

    // Return `true` if the element is configured as void
    return config.void === true;
  };

  editor.toggleMark = (mark: string, value?: boolean | string | number) => {
    // Check if the selection is already marked
    if (SlateEditor.marks(editor)[mark]) {
      // Remove the mark
      editor.removeMark(mark);
    } else {
      // Apply the mark with the specified value
      editor.addMark(mark, value ?? true);
    }
  };

  return editor;
}

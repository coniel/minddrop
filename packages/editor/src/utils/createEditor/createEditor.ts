import {
  createEditor as createSlateEditor,
  Editor as SlateEditor,
} from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { Editor } from '../../types';
import { ElementConfigsStore } from '../../ElementConfigsStore';

/**
 * Creates a new editor configured with the React and History
 * plugins, as well as support for registered Elements.
 *
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
    const config = ElementConfigsStore.get(element.type);

    // Return `true` if the element is configured as inline level
    return config && config.level === 'inline';
  };

  // Checks if an element is a void
  editor.isVoid = (element) => {
    // Get the element's configuration object
    const config = ElementConfigsStore.get(element.type);

    // Return `true` if the element is configured as void
    return config && config.void === true;
  };

  editor.toggleMark = (mark: string, value?: boolean | string | number) => {
    // Check if the selection is already marked
    if ((SlateEditor.marks(editor) || {})[mark]) {
      // Remove the mark
      editor.removeMark(mark);
    } else {
      // Apply the mark with the specified value
      editor.addMark(mark, value ?? true);
    }
  };

  return editor;
}

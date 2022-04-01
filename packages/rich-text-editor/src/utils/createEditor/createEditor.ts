import { RichTextElements } from '@minddrop/rich-text';
import { createEditor as createSlateEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { Editor } from '../../types';

/**
 * Creates a new editor configured with the React and History
 * plugins, as well as support for `RichTextElement`s.
 *
 * @returns An editor.
 */
export function createEditor(): Editor {
  // Create a Slate editor with the React and History plugins
  const editor = withReact(withHistory(createSlateEditor()));

  // Checks if an element is an inline level element
  editor.isInline = (element) => {
    // Get the element's configuration object
    const config = RichTextElements.getConfig(element.type);

    // Return `true` if the element is configured an inline level
    return config.level === 'inline';
  };

  // Checks if an element is a void
  editor.isVoid = (element) => {
    // Get the element's configuration object
    const config = RichTextElements.getConfig(element.type);

    // Return `true` if the element is configured as void
    return config.void === true;
  };

  return editor;
}

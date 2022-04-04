import { RichTextElements } from '@minddrop/rich-text';
import { createEditor as createSlateEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { Editor } from '../../types';
import { withElementIds } from '../../withElementIds';
import { withParentReferences } from '../../withParentReferences';

/**
 * Creates a new editor configured with the React and History
 * plugins, as well as support for `RichTextElement`s.
 *
 * @param documentId The ID of the rich text document being edited.
 * @returns An editor instance.
 */
export function createEditor(documentId: string): Editor {
  // Create a Slate editor with the React, history, element ID,
  // and parent reference plugins.
  const editor = withParentReferences(
    withElementIds(withReact(withHistory(createSlateEditor()))),
    documentId,
  );

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

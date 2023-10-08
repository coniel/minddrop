/* eslint-disable no-param-reassign */
import { Editor as SlateEditor } from 'slate';
import { Transforms } from '../Transforms';
import { Editor, RichTextBlockElement } from '../types';
import { getElementAbove } from '../utils';
import { toPlainText } from '../toPlainText';
import { convertRichTextElement } from '../convertRichTextElement';

/**
 * Resets block elements to the default type when pressing Enter
 * on an empty element, or deleting backwards at the start of the
 * element.
 *
 * @param editor An editor instance.
 * @param defaultType The default element type to reset to.
 * @returns The editor instance with the plugin behaviour applied.
 */
export function withBlockReset(
  editor: Editor,
  defaultType: string = 'paragraph',
): Editor {
  const { insertBreak, deleteBackward } = editor;

  // Overwride default insertBreak behaviour
  editor.insertBreak = () => {
    // Get the element entry in which the break was inserted
    const entry = getElementAbove(editor);

    if (!entry) {
      return;
    }

    const element = entry[0] as RichTextBlockElement;

    if (
      // Is not an inline element
      !editor.isInline(element) &&
      // Is not of the default type
      element.type !== defaultType &&
      // Does not contain text
      toPlainText([element]) === ''
    ) {
      // Convert the element to the default type
      const converted = convertRichTextElement(element, defaultType);

      // Unset the current element data other than type
      Transforms.unsetNodes(
        editor,
        Object.keys(element).filter((key) => key !== 'type'),
      );

      // Set the converted element data
      Transforms.setNodes(editor, converted as RichTextBlockElement);
    } else {
      // Insert a break as normal
      insertBreak();
    }
  };

  // Overwride default deleteBackward behaviour
  editor.deleteBackward = (unit) => {
    const entry = getElementAbove(editor);

    if (!entry || !editor.selection) {
      return;
    }

    const element = entry[0] as RichTextBlockElement;

    if (
      unit === 'character' &&
      !editor.isInline(element) &&
      element.type !== defaultType &&
      SlateEditor.isStart(editor, editor.selection.focus, editor.selection)
    ) {
      // Convert the element to the default type
      const converted = convertRichTextElement(element, defaultType);

      // Unset the current element data other than type and ID
      Transforms.unsetNodes(
        editor,
        Object.keys(element).filter((key) => key !== 'id' && key !== 'type'),
      );

      // Set the converted element data
      Transforms.setNodes(editor, converted as RichTextBlockElement);
    } else {
      deleteBackward(unit);
    }
  };

  return editor;
}

/* eslint-disable no-param-reassign */
import { RTElements } from '@minddrop/rich-text';
import { Editor as SlateEditor } from 'slate';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { getElementAbove } from '../utils';

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
    const element = getElementAbove(editor);

    if (
      // Is not an inline element
      !editor.isInline(element[0]) &&
      // Is not of the default type
      element[0].type !== defaultType &&
      // Does not contain text
      RTElements.toPlainText([element[0]]) === ''
    ) {
      // Convert the element to the default type
      const converted = RTElements.convert(element[0], defaultType);
      // Set the converted element data
      Transforms.setNodes(editor, converted);
    } else {
      // Insert a break as normal
      insertBreak();
    }
  };

  // Overwride default deleteBackward behaviour
  editor.deleteBackward = (unit) => {
    const element = getElementAbove(editor);

    if (
      unit === 'character' &&
      !editor.isInline(element[0]) &&
      element[0].type !== defaultType &&
      SlateEditor.isStart(editor, editor.selection.focus, editor.selection)
    ) {
      // Convert the element to the default type
      const converted = RTElements.convert(element[0], defaultType);
      // Set the converted element data
      Transforms.setNodes(editor, converted);
    } else {
      deleteBackward(unit);
    }
  };

  return editor;
}

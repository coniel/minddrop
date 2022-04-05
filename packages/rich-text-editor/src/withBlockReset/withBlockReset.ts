/* eslint-disable no-param-reassign */
import {
  RichTextBlockElementConfig,
  RichTextElements,
} from '@minddrop/rich-text';
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

  // Get the config for the default element type
  const config = RichTextElements.getConfig(
    defaultType,
  ) as RichTextBlockElementConfig;

  // Use the element config's convert function or a function
  // which returns an object containing the default type.
  const convert = config.convert || (() => ({ type: defaultType }));

  editor.insertBreak = () => {
    // Get the element entry in which the break was inserted
    const element = getElementAbove(editor);

    if (
      // Is not an inline element
      !editor.isInline(element[0]) &&
      // Is not of the default type
      element[0].type !== defaultType &&
      // Does not contain text
      RichTextElements.toPlainText([element[0]]) === ''
    ) {
      // Convert the element to the default type
      Transforms.setNodes(editor, convert(element[0]));
    } else {
      // Insert a break as normal
      insertBreak();
    }
  };

  editor.deleteBackward = (unit) => {
    const element = getElementAbove(editor);

    if (
      unit === 'character' &&
      !editor.isInline(element[0]) &&
      element[0].type !== defaultType &&
      SlateEditor.isStart(editor, editor.selection.focus, editor.selection)
    ) {
      // Convert the elemen to the default type
      Transforms.setNodes(editor, convert(element[0]));
    } else {
      deleteBackward(unit);
    }
  };
  return editor;
}

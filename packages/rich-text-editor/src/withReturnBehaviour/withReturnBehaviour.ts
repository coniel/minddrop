import {
  RichTextElements,
  RTBlockElement,
  RTBlockElementConfig,
} from '@minddrop/rich-text';
import { Transforms } from 'slate';
import { Editor } from '../types';
import { getElementAbove } from '../utils';

/**
 * Handles the insertion of breaks into the editor based
 * on the target element's `returnBehaviour` config.
 *
 * @param editor - The editor to which to apply the behaviour.
 * @returns The editor with the behaviour applied.
 */
export function withReturnBehaviour(editor: Editor): Editor {
  const { insertBreak } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.insertBreak = () => {
    // Get the block element in which the break was inserted
    const [element] = getElementAbove(editor);

    // Get the element's type config
    const config = RichTextElements.getTypeConfig(
      element.type,
    ) as RTBlockElementConfig;

    if (config.returnBehaviour === 'line-break') {
      // Insert a line break
      Transforms.insertText(editor, '\n');

      // Prevent regular break behaviour
      return;
    }

    // Insert the break as usual
    insertBreak();

    if (!config.returnBehaviour || config.returnBehaviour === 'break-out') {
      Transforms.setNodes(
        editor,
        { type: 'paragraph' },
        { at: editor.selection },
      );
    } else if (typeof config.returnBehaviour === 'function') {
      Transforms.setNodes(
        editor,
        config.returnBehaviour(element as RTBlockElement),
        {
          at: editor.selection,
        },
      );
    }
  };

  return editor;
}

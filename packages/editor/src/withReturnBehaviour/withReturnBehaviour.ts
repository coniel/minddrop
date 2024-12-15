import { Transforms } from 'slate';
import { Editor } from '../types';
import { getElementAbove } from '../utils';
import { EditorBlockElementConfigsStore } from '../BlockElementTypeConfigsStore';

/**
 * Handles the insertion of breaks into the editor based
 * on the target element's `returnBehaviour` config.
 *
 * @param editor - The editor to which to apply the behaviour.
 * @returns The editor with the behaviour applied.
 */
export function withReturnBehaviour(editor: Editor): Editor {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    // Get the block element in which the break was inserted
    const entry = getElementAbove(editor);
    const element = entry ? entry[0] : null;

    if (!element) {
      // Prevent regular break behaviour
      return;
    }

    // Get the element's type config
    const config = EditorBlockElementConfigsStore.get(element.type);

    if (!config) {
      return;
    }

    if (
      'returnBehaviour' in config &&
      config.returnBehaviour === 'line-break'
    ) {
      console.log('line-break');
      // Insert a line break
      Transforms.insertText(editor, '\n');

      // Prevent regular break behaviour
      return;
    }

    // Insert the break as usual
    insertBreak();

    if (!editor.selection) {
      return;
    }

    if (
      !('returnBehaviour' in config) ||
      config.returnBehaviour === 'break-out'
    ) {
      Transforms.setNodes(
        editor,
        { type: 'paragraph' },
        { at: editor.selection },
      );
    } else if (typeof config.returnBehaviour === 'function') {
      Transforms.setNodes(editor, config.returnBehaviour(element), {
        at: editor.selection,
      });
    }
  };

  return editor;
}

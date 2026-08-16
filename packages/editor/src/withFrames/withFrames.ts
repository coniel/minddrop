import { Range, Editor as SlateEditor } from 'slate';
import { Ast, Element, generateListItemFrame } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { outdentBlocks } from '../outdentBlocks';
import { Editor } from '../types';
import { getElementAbove, resolveSplitFrameRepair } from '../utils';

/**
 * Adds the editing behaviour of the containers blocks sit inside.
 *
 * Containers are ancestry data rather than nodes, so stepping in and out of
 * one rewrites the block's ancestry rather than moving it in the tree.
 *
 * @param editor - An editor instance.
 * @returns The editor instance with the plugin behaviour applied.
 */
export function withFrames(editor: Editor): Editor {
  const { insertBreak, deleteBackward, normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [, path] = entry;

    // Whether a container has been split apart is a property of the document
    // as a whole rather than of any one block
    if (!path.length) {
      const repair = resolveSplitFrameRepair(editor.children as Element[]);

      if (repair) {
        repair.forEach((ancestry, index) => {
          Transforms.setNodes<Element>(editor, { ancestry }, { at: [index] });
        });

        return;
      }
    }

    normalizeNode(entry);
  };

  editor.insertBreak = () => {
    const entry = getElementAbove(editor);

    if (!entry) {
      insertBreak();

      return;
    }

    const element = entry[0] as Element;
    const ancestry = element.ancestry || [];

    // Outside a container there is nothing to step out of or continue
    if (!ancestry.length) {
      insertBreak();

      return;
    }

    // Return on an empty block steps out of its innermost container rather
    // than adding another empty one below it
    if (Ast.toPlainText([element]) === '') {
      outdentBlocks(editor, [entry[1]]);

      return;
    }

    insertBreak();

    continueContainer(editor, ancestry);
  };

  editor.deleteBackward = (unit) => {
    const entry = getElementAbove(editor);

    // Deleting a selection, or deleting from anywhere but the very start of
    // a block, is an ordinary delete
    if (!entry || !editor.selection || !Range.isCollapsed(editor.selection)) {
      deleteBackward(unit);

      return;
    }

    const element = entry[0] as Element;
    const isBlockStart = SlateEditor.isStart(
      editor,
      editor.selection.anchor,
      entry[1],
    );

    // Backspace at the start of a contained block steps it out of its
    // innermost container before it starts deleting content
    if (isBlockStart && (element.ancestry || []).length) {
      outdentBlocks(editor, [entry[1]]);

      return;
    }

    deleteBackward(unit);
  };

  return editor;
}

/**
 * Places the block a return has just created into the container the block it
 * was split from sits in.
 *
 * The new block inherits its ancestry from the split, which continues a
 * quote or a footnote definition as it is. A list item instead gets a new
 * item, since a return in a list starts the next one.
 *
 * @param editor - An editor instance.
 * @param ancestry - The containers the block was split from sits inside.
 */
function continueContainer(
  editor: Editor,
  ancestry: Element['ancestry'],
): void {
  const containers = ancestry || [];
  const innermost = containers[containers.length - 1];

  if (!editor.selection || innermost?.kind !== 'list-item') {
    return;
  }

  Transforms.setNodes<Element>(
    editor,
    {
      ancestry: [...containers.slice(0, -1), generateListItemFrame(innermost)],
    },
    { at: [editor.selection.anchor.path[0]] },
  );
}

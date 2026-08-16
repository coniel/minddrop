import {
  Node,
  Path,
  Editor as SlateEditor,
  Element as SlateElement,
} from 'slate';
import { Ast, Element, Frame } from '@minddrop/ast';
import { getEditorElementConfig } from '../EditorElementConfigs';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import {
  isBlockElement,
  opensInnermostFrame,
  resolveMenuItemAncestry,
} from '../utils';

/**
 * Inserts a block element of the given type at the cursor.
 *
 * Replaces the current block if it is empty, otherwise inserts
 * the new element below it. The cursor is placed in the inserted
 * element.
 *
 * The element lands in the containers the cursor was already in, so
 * inserting into a list or a quote stays there.
 *
 * @param editor An editor instance.
 * @param type The block element type to insert.
 * @param data Element data applied over the element type's initial data.
 * @param frame Builds the container the element is drawn inside, for types which nest.
 */
export function insertBlockElement<TElement extends Element = Element>(
  editor: Editor,
  type: string,
  data?: Partial<TElement>,
  frame?: () => Frame,
): void {
  const config = getEditorElementConfig(type);

  // Element types must have a component in order to be rendered
  if (!config) {
    return;
  }

  const element = { ...Ast.generateElement(type), ...data } as Element;

  // The block element the cursor is currently in
  const entry = SlateEditor.above<Element>(editor, {
    match: (node) =>
      SlateElement.isElement(node) && isBlockElement((node as Element).type),
  });

  // Without a block to insert relative to, append to the document
  if (!entry) {
    insertAt(editor, withAncestry(element, frame ? [frame()] : []), [
      editor.children.length,
    ]);

    return;
  }

  const [block, blockPath] = entry;

  // The element takes the place of the block it is inserted at, so it takes
  // the containers that block sat in
  const ancestry = resolveMenuItemAncestry(
    block.ancestry || [],
    opensInnermostFrame(editor.children as Element[], blockPath[0]),
    frame?.(),
  );

  // Empty blocks are replaced rather than being left behind above
  // the inserted element. Void blocks hold no text of their own,
  // so an empty one is still content.
  const replaceBlock = !editor.isVoid(block) && Node.string(block) === '';

  if (replaceBlock) {
    Transforms.removeNodes(editor, { at: blockPath });
  }

  insertAt(
    editor,
    withAncestry(element, ancestry),
    replaceBlock ? blockPath : Path.next(blockPath),
  );
}

/**
 * Returns an element sitting inside the given containers.
 *
 * @param element The element.
 * @param ancestry The containers the element sits inside.
 * @returns The element.
 */
function withAncestry(element: Element, ancestry: Frame[]): Element {
  // A block in no container carries no ancestry at all
  if (!ancestry.length) {
    return element;
  }

  return { ...element, ancestry };
}

/**
 * Inserts an element at a path and places the cursor in it.
 *
 * @param editor An editor instance.
 * @param element The element to insert.
 * @param path The path at which to insert the element.
 */
function insertAt(editor: Editor, element: Element, path: Path): void {
  // Insert the element
  Transforms.insertNodes(editor, element, { at: path });

  // Place the cursor at the end of the inserted element
  Transforms.select(editor, SlateEditor.end(editor, path));
}

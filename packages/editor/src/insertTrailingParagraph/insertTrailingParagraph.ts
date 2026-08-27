import {
  Descendant,
  Node,
  Editor as SlateEditor,
  Element as SlateElement,
} from 'slate';
import { Ast } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { isTableElement } from '../tables/table-elements';
import { Editor } from '../types';

const PARAGRAPH_ELEMENT_TYPE = 'paragraph';

/**
 * Places the cursor in an empty element at the end of the
 * document, appending an empty paragraph if the document does not
 * already end in an empty element.
 *
 * @param editor An editor instance.
 */
export function insertTrailingParagraph(editor: Editor): void {
  // The document's current last node
  const lastIndex = editor.children.length - 1;
  const lastNode = editor.children[lastIndex] as Descendant | undefined;

  // Path of the element the cursor is placed in
  let path = [lastIndex];

  // Append a paragraph unless the document already ends in an empty element
  if (!lastNode || !isEmptyElement(editor, lastNode)) {
    path = [lastIndex + 1];

    Transforms.insertNodes(
      editor,
      Ast.generateElement(PARAGRAPH_ELEMENT_TYPE),
      { at: path },
    );
  }

  // Place the cursor in the trailing element
  Transforms.select(editor, SlateEditor.end(editor, path));
}

/**
 * Checks whether a node is an element which contains no text and
 * into which text can be typed.
 *
 * @param editor An editor instance.
 * @param node A document node.
 * @returns Whether the node is an empty element.
 */
function isEmptyElement(editor: Editor, node: Descendant): boolean {
  // Text nodes are not elements
  if (!SlateElement.isElement(node)) {
    return false;
  }

  // Void elements have no text of their own, so an empty one is
  // not somewhere the cursor can type
  if (editor.isVoid(node)) {
    return false;
  }

  // A table is a grid rather than a blank line, so even one with empty
  // cells is not the trailing element a click below the content expects
  if (isTableElement(node)) {
    return false;
  }

  return Node.string(node) === '';
}

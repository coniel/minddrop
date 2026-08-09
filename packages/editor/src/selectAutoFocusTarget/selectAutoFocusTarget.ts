import {
  Descendant,
  Node,
  Editor as SlateEditor,
  Element as SlateElement,
} from 'slate';
import { Ast } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { TITLE_ELEMENT_TYPE } from '../withTitle';

const PARAGRAPH_ELEMENT_TYPE = 'paragraph';

/**
 * Places the caret at the position an autofocused editor should
 * start typing from: the end of the title when the document has
 * no body content, the end of the document otherwise. When the
 * document ends in a void element, appends an empty paragraph
 * for the caret to land in.
 *
 * @param editor An editor instance.
 */
export function selectAutoFocusTarget(editor: Editor): void {
  // Blank documents place the caret in the title so it can be
  // typed right away
  if (startsWithTitle(editor) && hasEmptyBody(editor)) {
    Transforms.select(editor, SlateEditor.end(editor, [0]));

    return;
  }

  // The document's current last node
  const lastIndex = editor.children.length - 1;
  const lastNode = editor.children[lastIndex] as Descendant | undefined;

  // Append an empty paragraph when the caret cannot be placed in
  // the last node
  if (!lastNode || isVoidElement(editor, lastNode)) {
    Transforms.insertNodes(
      editor,
      Ast.generateElement(PARAGRAPH_ELEMENT_TYPE),
      { at: [lastIndex + 1] },
    );
  }

  // Place the caret at the end of the document
  Transforms.select(editor, SlateEditor.end(editor, []));
}

/**
 * Checks whether a document begins with a title element.
 *
 * @param editor An editor instance.
 * @returns Whether the first node is a title element.
 */
function startsWithTitle(editor: Editor): boolean {
  const firstNode = editor.children[0] as Descendant | undefined;

  return (
    SlateElement.isElement(firstNode) && firstNode.type === TITLE_ELEMENT_TYPE
  );
}

/**
 * Checks whether the document contains no content besides its
 * leading title element.
 *
 * @param editor An editor instance.
 * @returns Whether the body is empty.
 */
function hasEmptyBody(editor: Editor): boolean {
  // The document's nodes following the title
  const body = editor.children.slice(1);

  // The body is empty when every node is a textless non-void
  // element, since void elements count as content
  return body.every(
    (node) =>
      SlateElement.isElement(node) &&
      !editor.isVoid(node) &&
      Node.string(node) === '',
  );
}

/**
 * Checks whether a node is a void element.
 *
 * @param editor An editor instance.
 * @param node A document node.
 * @returns Whether the node is a void element.
 */
function isVoidElement(editor: Editor, node: Descendant): boolean {
  return SlateElement.isElement(node) && editor.isVoid(node);
}

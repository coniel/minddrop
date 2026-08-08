import { Path, Element as SlateElement } from 'slate';
import { ReactEditor } from 'slate-react';
import { Element } from '@minddrop/ast';
import { Editor } from '../../types';

export interface BlockAtDomNode {
  /**
   * The top level block element containing the DOM node.
   */
  element: Element;

  /**
   * The path of the block element.
   */
  path: Path;

  /**
   * The DOM element rendering the block.
   */
  domNode: HTMLElement;
}

/**
 * Gets the top level block element containing a DOM node, used to
 * resolve the block under the pointer.
 *
 * @param editor An editor instance.
 * @param node A DOM node inside the editor.
 * @returns The block, or null if the node is not inside a top level block.
 */
export function getBlockFromDomNode(
  editor: Editor,
  node: Node | null,
): BlockAtDomNode | null {
  const editorNode = getEditorDomNode(editor);

  // Without the editor's DOM node there is nothing to resolve against
  if (!editorNode || !node) {
    return null;
  }

  // Text nodes are not rendered by an element of their own
  const startElement = node instanceof HTMLElement ? node : node.parentElement;

  if (!startElement || !editorNode.contains(startElement)) {
    return null;
  }

  // Top level blocks are the editor's direct children, so walk up
  // to the ancestor which is one of them.
  let domNode: HTMLElement | null = startElement;

  while (domNode && domNode.parentElement !== editorNode) {
    domNode = domNode.parentElement;
  }

  if (!domNode) {
    return null;
  }

  let element: Element;
  let path: Path;

  try {
    const slateNode = ReactEditor.toSlateNode(editor, domNode);

    // Only elements are blocks
    if (!SlateElement.isElement(slateNode)) {
      return null;
    }

    element = slateNode as Element;
    path = ReactEditor.findPath(editor, slateNode);
  } catch {
    // The DOM node may not be mapped to a Slate node, e.g. when it
    // is rendered by the editor rather than by the document.
    return null;
  }

  return { element, path, domNode };
}

/**
 * Gets the DOM node rendering the editor's content.
 *
 * @param editor An editor instance.
 * @returns The editor's DOM node, or null if it is not rendered.
 */
function getEditorDomNode(editor: Editor): HTMLElement | null {
  try {
    return ReactEditor.toDOMNode(editor, editor);
  } catch {
    return null;
  }
}

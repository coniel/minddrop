import {
  RichTextElement,
  UpdateRichTextElementData,
} from '@minddrop/rich-text';
import { Node, Path, Text } from 'slate';
import { Editor } from '../types';
import { getElementAbove } from '../utils';

export interface RichTextElementsApi {
  createElement(element: RichTextElement): void;
  updateElement(elementId: string, changes: UpdateRichTextElementData): void;
  deleteElement(elementId: string): void;
  setDocumentChildren(children: string[]): void;
}

/**
 * Creates, updates, and deletes rich text elements via the supplied
 * API as the document is modified. Updates the document's children
 * when root level elements are added, removed, or moved.
 *
 * @param editor An editor instance.
 * @param api The API used to modify the elements and document.
 * @returns The editor instance with the plugin behaviour.
 */
export function withRichTextElementsApi(
  editor: Editor,
  api: RichTextElementsApi,
): Editor {
  const { apply } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.apply = (operation) => {
    // Text was inserted or removed
    if (operation.type === 'insert_text' || operation.type === 'remove_text') {
      // Apply the operation to actually update the text
      // in the element.
      apply(operation);

      // Get the affected element entry
      const element = getElementAbove(editor, { at: operation.path });

      // Update the element's children
      api.updateElement(element[0].id, { children: element[0].children });

      return;
    }

    // A node was inserted
    if (operation.type === 'insert_node') {
      // Apply the operation to actually insert the node
      apply(operation);

      // Get the node's parent element
      const parent = getElementAbove(editor, { at: operation.path });

      // If the inserted node is a text node, update the parent element
      if (Text.isText(operation.node)) {
        // Update the parent element
        api.updateElement(parent[0].id, { children: parent[0].children });
        return;
      }

      // Create the element.
      api.createElement(operation.node as RichTextElement);

      // If the element was inserted at the root level, update the document children
      if (!parent) {
        api.setDocumentChildren(
          editor.children.map((child) => (child as RichTextElement).id),
        );
      }

      return;
    }

    // Data was set on an existing node
    if (operation.type === 'set_node') {
      // Apply the operation to actually set the node data
      apply(operation);

      // Get the affected node
      const node = Node.get(editor, operation.path);
      // Get the parent element entry
      const parent = getElementAbove(editor, { at: operation.path });

      if (Text.isText(node)) {
        // If the node is a text node, update the parent element's children
        api.updateElement(parent[0].id, { children: parent[0].children });

        return;
      }

      // The affected node is an element
      const element = node as RichTextElement;

      // Update the element, setting its updated properties

      api.updateElement(
        element.id,
        operation.newProperties as UpdateRichTextElementData,
      );

      return;
    }

    // A node was removed
    if (operation.type === 'remove_node') {
      apply(operation);

      const parent = Node.get(editor, Path.parent(operation.path));

      // If the node is a text node, update the parent element's children
      if (Text.isText(operation.node)) {
        // Parent is an element
        const element = parent as RichTextElement;
        // Update the parent element's children
        api.updateElement(element.id, { children: element.children });

        return;
      }

      // Node is an element
      const element = operation.node as RichTextElement;

      // Delete the element
      api.deleteElement(element.id);

      // If the element was at the root level, update the document children
      if (operation.path.length === 1) {
        api.setDocumentChildren(
          editor.children.map((child) => (child as RichTextElement).id),
        );
      }

      return;
    }

    // A node was split into two nodes
    if (operation.type === 'split_node') {
      // Apply the operation, so that the node is actually split
      apply(operation);

      // Get the node which was split
      const splitNode = Node.get(editor, operation.path);

      if (Text.isText(splitNode)) {
        // Ignore split text nodes, their parent is updated by
        // the element split operation following this one.
        return;
      }

      // The split node is an element
      const splitElement = splitNode as RichTextElement;

      // Update the element which aws split
      api.updateElement(splitElement.id, { children: splitElement.children });

      // Get the element created as a result of the split
      const newElement = Node.get(
        editor,
        Path.next(operation.path),
      ) as RichTextElement;

      // Create the new element
      api.createElement(newElement);

      // If the new element is a root level element, update
      // the document children.
      if (operation.path.length === 1) {
        api.setDocumentChildren(
          editor.children.map((child) => (child as RichTextElement).id),
        );
      }

      return;
    }

    // A node was merged into the node above it
    if (operation.type === 'merge_node') {
      // Apply the operation to actaully merge the nodes
      apply(operation);

      // Get the merged-into node
      const mergedIntoNode = Node.get(editor, Path.previous(operation.path));

      // If the merged-into node is a text node, update
      // the parent element's children.
      if (Text.isText(mergedIntoNode)) {
        // Get the parent element entry
        const parent = getElementAbove(editor, {
          at: Path.previous(operation.path),
        });

        // Update the parent element's children
        api.updateElement(parent[0].id, { children: parent[0].children });

        return;
      }

      // Merged-into node is an element
      const mergedIntoElement = mergedIntoNode as RichTextElement;

      // Update the element's children
      api.updateElement(mergedIntoElement.id, {
        children: mergedIntoElement.children,
      });

      // The merged node is an element
      const mergedElement = operation.properties as RichTextElement;

      // Delete the merged element
      api.deleteElement(mergedElement.id);

      // If the merged element is a root level element, update
      // the document children.
      if (operation.path.length === 1) {
        api.setDocumentChildren(
          editor.children.map((child) => (child as RichTextElement).id),
        );
      }

      return;
    }

    // operation.type === 'move_node'
    // Update the old parent, removing the element.
    // Update its new parent, adding the element.
    // If the element was moved within the document root
    // level, update the document.

    // Call the default apply method
    apply(operation);
  };

  return editor;
}

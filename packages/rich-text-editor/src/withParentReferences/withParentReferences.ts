import { ResourceReferences } from '@minddrop/resources';
import { RTElement } from '@minddrop/rich-text';
import { Text, Node, Path } from 'slate';
import { Transforms } from '../Transforms';
import { Editor } from '../types';

/**
 * Manages parent references on rich text elements within
 * the document:
 * - Adds a document parent reference to all inserted elements.
 * - Adds an element parent references to inline/nested elements.
 * - Updates inline/nested element parent references when their
 *   parent element is merged/split.
 *
 * @param editor An editor instance.
 * @param documentId The ID of the document being edited.
 * @returns The editor instance with the plugin behaviour.
 */
export function withParentReferences(
  editor: Editor,
  documentId: string,
): Editor {
  const { apply } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.apply = (operation) => {
    // A node was inserted
    if (operation.type === 'insert_node') {
      if (Text.isText(operation.node)) {
        // If the inserted node is a text node,
        // simply apply the operation
        apply(operation);

        return;
      }

      // Get the parent element if there is one
      const parent =
        operation.path.length > 1
          ? (Node.get(editor, Path.parent(operation.path)) as RTElement)
          : null;

      // The node is a rich text element
      let element = operation.node as RTElement;

      // Check if the document is already present as a parent on the element
      const hasDocumentAsParent = ResourceReferences.getIds(
        'rich-text:document',
        element.parents,
      ).includes(documentId);

      if (!hasDocumentAsParent) {
        // Add the document as a parent on the element if not already present
        element = {
          ...element,
          parents: [
            ...element.parents,
            ResourceReferences.generate('rich-text:document', documentId),
          ],
        };
      }

      if (parent) {
        // Check if the parent element is already present as a parent
        // on the element.
        const hasParentReference = ResourceReferences.getIds(
          'rich-text:element',
          element.parents,
        ).includes(parent.id);

        if (!hasParentReference) {
          // If there is a parent element, add a reference to it in the
          // element if not already present.
          element = {
            ...element,
            parents: [
              ...element.parents,
              ResourceReferences.generate('rich-text:element', parent.id),
            ],
          };
        }
      }

      // Apply the operation to actually insert the element node
      apply({ ...operation, node: element });

      return;
    }

    // A node was split into two
    if (operation.type === 'split_node') {
      // Apply the operation to actually split the node
      apply(operation);

      // Get the node which was split
      const splitNode = Node.get(editor, operation.path);

      if (Text.isText(splitNode)) {
        // Ignore split text nodes as they do not have a
        // `parents` property.
        return;
      }

      // Get the element which was split
      const splitElement = Node.get(editor, operation.path) as RTElement;
      // The path of the element created as a result of the split
      const newElementPath = Path.next(operation.path);
      // Get the new element
      const element = Node.get(editor, newElementPath) as RTElement;

      // Update the element's child elements, removing the old
      // parent reference and adding a reference to the new one.
      if (element.children) {
        element.children.forEach((child, index) => {
          if (!Text.isText(child)) {
            Transforms.setNodes(
              editor,
              {
                parents: [
                  // Filter out previous parent element from existing parents
                  ...element.parents.filter(
                    (parent) =>
                      parent.resource === 'rich-text:element' &&
                      parent.id === splitElement.id,
                  ),
                  // Add a reference to the new parent element
                  ResourceReferences.generate('rich-text:element', element.id),
                ],
              },
              { at: [...newElementPath, index] },
            );
          }
        });
      }

      return;
    }

    // A node was marged into the one above
    if (operation.type === 'merge_node') {
      // Get the node which is being deleted as a result of the merge
      const mergeNode = Node.get(editor, operation.path);

      // Apply the operation to actaully merge the nodes
      apply(operation);

      // Get the merged-into node
      const mergedIntoNode = Node.get(editor, Path.previous(operation.path));

      if (Text.isText(mergedIntoNode)) {
        // Ignore merged text nodes as they do not have a
        // `parents` property.
        return;
      }

      // Affected nodes are a elements
      const deletedElement = mergeNode as RTElement;
      const element = mergedIntoNode as RTElement;

      // Update the element's child elements, removing the old
      // parent reference and adding a reference to the new one.
      if (element.children) {
        element.children.forEach((child, index) => {
          if (!Text.isText(child)) {
            Transforms.setNodes(
              editor,
              {
                parents: [
                  // Filter out previous parent element from existing parents
                  ...element.parents.filter(
                    (parent) =>
                      parent.resource === 'rich-text:element' &&
                      parent.id === deletedElement.id,
                  ),
                  // Add a reference to the new parent element
                  ResourceReferences.generate('rich-text:element', element.id),
                ],
              },
              { at: [...Path.previous(operation.path), index] },
            );
          }
        });
      }

      return;
    }

    // Nothing needs to be done here, apply the operation
    apply(operation);
  };

  return editor;
}

import { RTElement, RTNode } from '@minddrop/rich-text';

// Slate requires that all elements, including void elements, have
// a `children` property containing at least an empty text node.
// Void `RTElement`s don't contain a `children` property, so
// this function adds it.

/**
 * Adds a `children` property containing a single empty RTNode
 * to void elements which do not have children.
 *
 * @param nodes The nodes in which to add children to void elements.
 * @returns The nodes with children added to void elements.
 */
export function addChildrenToVoidElements(nodes: (RTElement | RTNode)[]) {
  // Loop through the nodes, adding chilidren to void nodes which have none
  return nodes.map((node) => {
    // If the node has a 'type', it is a rich text element
    if ('type' in node) {
      if (!node.children) {
        // If the element has no children, add an empty text node as its children
        return { ...node, children: [{ text: '' }] };
      }

      // If the element has children, run the function on its children
      return { ...node, children: addChildrenToVoidElements(node.children) };
    }

    // The node is a RTNode, return it as is
    return node;
  });
}

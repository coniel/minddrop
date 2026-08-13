import { DesignElement, Layout } from '@minddrop/designs-legacy';

/**
 * Returns the layout with the target view element's static
 * content set.
 *
 * @param layout - The layout containing the element.
 * @param elementId - The ID of the element to update.
 * @param content - The static content to set.
 * @returns The updated layout.
 */
export function setLayoutElementContent(
  layout: Layout,
  elementId: string,
  content: string,
): Layout {
  return {
    ...layout,
    tree: {
      ...layout.tree,
      children: layout.tree.children.map((child) =>
        setElementContent(child, elementId, content),
      ),
    },
  };
}

/**
 * Sets the content on the matched view element, recursing into
 * containers.
 */
function setElementContent(
  element: DesignElement,
  elementId: string,
  content: string,
): DesignElement {
  if (element.id === elementId && element.type === 'view') {
    return { ...element, content };
  }

  if ('children' in element) {
    return {
      ...element,
      children: element.children.map((child) =>
        setElementContent(child, elementId, content),
      ),
    };
  }

  return element;
}

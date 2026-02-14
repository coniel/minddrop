import {
  ContainerElementTree,
  ElementSchema,
  LeafElementSchema,
  RootElementTree,
} from '../types';

/**
 * Parses an element tree into a [id]: [element] map of elements.
 *
 * @param elementTree The element tree to parse.
 * @returns A [id]: [element] map of elements.
 */
export function parseElementTree(
  elementTree: RootElementTree,
): Record<string, ElementSchema> {
  const elements: Record<string, ElementSchema> = {};

  function addElement(
    element: LeafElementSchema | ContainerElementTree | RootElementTree,
  ) {
    // If the element has children, replace them with their IDs
    // and recursively add the children to the elements map.
    if ('children' in element) {
      elements[element.id] = {
        ...element,
        children: element.children.map((child) => child.id),
      };

      element.children.forEach((child) => addElement(child));
    } else {
      elements[element.id] = element;
    }
  }

  // Add the root element to the elements map
  addElement(elementTree);

  return elements;
}

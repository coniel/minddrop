import { Element, ElementTypeConfig } from '../types';

export function hasBlockChildren(
  elementConfigs: ElementTypeConfig[],
  element: Element,
): element is Element & { children: Element[] } {
  // Get the element's configuration object
  const config = elementConfigs.find((c) => c.type === element.type);

  if (!config) {
    return false;
  }

  // If the element has no children, it can't have block children
  if (!element.children || !element.children.length) {
    return false;
  }

  // Get the element type configuration for the first child element
  const fistChildConfig = elementConfigs.find(
    (c) => c.type === element.children[0].type,
  );

  if (!fistChildConfig) {
    return false;
  }

  // Check if the first child element is a block element, they must
  // all be block elements.
  return fistChildConfig.display === 'block';
}

import { Element, TextElement } from '../types';

/**
 * Returns the raw content of a literal element, which is held in a single
 * text child so that the editor can edit it.
 *
 * @param element - The literal element.
 * @returns The element's raw content.
 */
export function getLiteralContent(element: Element): string {
  const [child] = element.children;

  // Literal elements always hold a single text child, but a normalizer
  // failure should not take down serialization
  if (!child || 'type' in child) {
    return '';
  }

  return (child as TextElement).text;
}

import {
  Element,
  ContainerBlockElement,
  VoidBlockElement,
  BlockElement,
  InlineElement,
  VoidInlineElement,
} from '../types';

/**
 * Check if an element is a block element.
 *
 * @param element - The element to check.
 * @returns True if the element is a block element, false otherwise.
 */
export function isBlockElement(element: Element): element is BlockElement {
  return element.display === 'block';
}

/**
 * Check if an element is a container block element.
 *
 * @param element - The element to check.
 * @returns True if the element is a container block element, false otherwise.
 */
export function isContainerBlockElement(
  element: Element,
): element is ContainerBlockElement {
  return (
    isBlockElement(element) && 'isContainer' in element && element.isContainer
  );
}

/**
 * Check if an element is a void block element.
 *
 * @param element - The element to check.
 * @returns True if the element is a void block element, false otherwise.
 */
export function isVoidBlockElement(
  element: Element,
): element is VoidBlockElement {
  return isBlockElement(element) && 'isVoid' in element && element.isVoid;
}

/**
 * Check if an element is an inline element.
 *
 * @param element - The element to check.
 * @returns True if the element is an inline element, false otherwise.
 */
export function isInlineElement(element: Element): element is InlineElement {
  return element.display === 'inline';
}

/**
 * Check if an element is a void inline element.
 *
 * @param element - The element to check.
 * @returns True if the element is a void inline element, false otherwise.
 */
export function isVoidInlineElement(
  element: Element,
): element is VoidInlineElement {
  return isInlineElement(element) && 'isVoid' in element && element.isVoid;
}

/**
 * Check if a node is an element.
 *
 * @param node - The node to check.
 * @returns True if the node is an element, false otherwise.
 */
export function isElement(node: unknown): node is Element {
  if (typeof node !== 'object' || node === null) {
    return false;
  }

  const element = node as Element;

  return isBlockElement(element) || isInlineElement(element);
}

/**
 * Check if an element is a void element.
 *
 * @param element - The element to check.
 * @returns True if the element is a void element, false otherwise.
 */
export function isVoidElement(element: Element): element is VoidBlockElement {
  return isVoidBlockElement(element) || isVoidInlineElement(element);
}

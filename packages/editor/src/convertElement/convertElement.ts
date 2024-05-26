import { ElementConfigsStore } from '../ElementConfigsStore';
import { BlockElement, BlockElementConfig } from '../types';

/**
 * Converts a block element from one type to another type.
 * The new element type must be reigstered.
 *
 * @param element - The element to convert.
 * @param newType - The element type to convert it to.
 * @returns The converted element.
 */
export function convertElement(
  element: BlockElement,
  newType: string,
): BlockElement {
  // Get the new element config
  const config = ElementConfigsStore.get(newType) as BlockElementConfig;

  if (!config) {
    // If the new element type is not a registered type,
    // do not convert.
    return element;
  }

  if (config.convert) {
    // Convert using new type's convert callback
    return config.convert(element);
  }

  return {
    ...element,
    type: newType,
  };
}

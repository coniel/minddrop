import { RichTextElementConfigsStore } from '../RichTextElementConfigsStore';
import { RichTextBlockElement, RichTextBlockElementConfig } from '../types';

/**
 * Converts a rich text block element from one type
 * to another type. The new element type must be
 * reigstered.
 *
 * @param element - The element to convert.
 * @param newType - The element type to convert it to.
 * @returns The converted element.
 */
export function convertRichTextElement(
  element: RichTextBlockElement,
  newType: string,
): RichTextBlockElement {
  // Get the new element config
  const config = RichTextElementConfigsStore.get(
    newType,
  ) as RichTextBlockElementConfig;

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

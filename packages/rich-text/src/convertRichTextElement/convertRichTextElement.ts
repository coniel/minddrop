import { InvalidParameterError } from '@minddrop/utils';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import { initializeRichTextElementData } from '../initializeRichTextElementData';
import { toPlainText } from '../toPlainText';
import { RichTextBlockElement } from '../types';

const preservedFields: (keyof RichTextBlockElement)[] = [
  'id',
  'parents',
  'children',
  'nestedElements',
  'files',
  'deleted',
  'deletedAt',
];

/**
 * Converts a rich text block element from one type to another.
 *
 * - Throws a `RichTextElementTypeNotRegistered` if the current
 *   or new element type is not registered
 * - Throws a `InvalidParameterError` if the either the element
 *   or the new element type are not 'block' level elements.
 * - Throws a `RichTextElementValidationError` if the updated
 *   element is invalid.
 *
 * @param element The element to convert.
 * @param type The element type to convert to.
 * @returns The converted element.
 */
export function convertRichTextElement<
  TElement extends RichTextBlockElement = RichTextBlockElement,
>(element: RichTextBlockElement, type: string): TElement {
  // Get the current element type config
  const currentConfig = getRichTextElementConfig(element.type);
  // Get the new element type config
  const config = getRichTextElementConfig(type);

  if (currentConfig.level !== 'block') {
    // Throw a `InvalidParameterError` if the current element
    // type is not a block level element.
    throw new InvalidParameterError(
      'only block level elements may be converted',
    );
  }

  if (config.level !== 'block') {
    // Throw a `InvalidParameterError` if the new element type
    // is not a block level element.
    throw new InvalidParameterError(
      'elements may only be converted to block level element types',
    );
  }

  // Clone the element, preserving only default field types
  let converted: Partial<RichTextBlockElement> = Object.keys(element).reduce(
    (fields, key) =>
      preservedFields.includes(key as keyof RichTextBlockElement)
        ? { ...fields, [key]: element[key] }
        : fields,
    {},
  );

  // Set the new element type
  converted.type = type;

  // Generate the new element type's initial data
  const initialData = initializeRichTextElementData(type);

  // Generate the conversion data
  const conversionData = config.convertData ? config.convertData(element) : {};

  // Merge in the new element's data
  converted = { ...converted, ...initialData, ...conversionData };

  if (config.void) {
    // Remove `children` if converting to a void element type
    delete converted.children;
  }

  if (currentConfig.void && !config.void) {
    // Add `children` if converting from a void to a non-void element
    converted.children = [{ text: toPlainText(element) }];
  }

  return converted as TElement;
}

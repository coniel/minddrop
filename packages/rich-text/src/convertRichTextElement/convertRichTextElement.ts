import { InvalidParameterError } from '@minddrop/utils';
import { initializeRichTextElementData } from '../initializeRichTextElementData';
import { RTElementsResource } from '../RTElementsResource';
import { toPlainText } from '../toPlainText';
import { RTBlockElement, RTElement, RTElementTypeData } from '../types';

const preservedFields: (keyof RTBlockElement)[] = [
  'id',
  'parents',
  'children',
  'nestedElements',
  'deleted',
  'deletedAt',
];

/**
 * Converts a rich text block element from one type to another.
 *
 * @param element - The element to convert.
 * @param type - The element type to convert to.
 * @returns The converted element.
 *
 * @throws ResourceTypeNotRegistered
 * Thrown if the current or new element type is not registered
 *
 * @throws InvalidParameterError
 * Thrown if the either the element or the new element type are
 * not 'block' level elements.
 *
 * @throws ResourceValidationError
 * Thrown if the resulting rich text element is invalid.
 */
export function convertRichTextElement<
  TTypeData extends RTElementTypeData = {},
>(element: RTBlockElement, type: string): RTElement<TTypeData> {
  // Get the current element type config
  const currentConfig = RTElementsResource.getTypeConfig(element.type);
  // Get the new element type config
  const config = RTElementsResource.getTypeConfig(type);

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
  let converted: Partial<RTBlockElement> = Object.keys(element).reduce(
    (fields, key) =>
      preservedFields.includes(key as keyof RTBlockElement)
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

  return converted as RTElement<TTypeData>;
}

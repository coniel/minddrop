import { FileBasedPropertySchema, PropertySchema } from '../types';
import { isFileBasedPropertyType } from './isFileBasedPropertyType';

/**
 * Checks whether a property is file based.
 *
 * @param property - The property schema.
 * @returns Whether the property is file based.
 */
export function isFileBasedProperty(
  property: PropertySchema,
): property is FileBasedPropertySchema {
  return isFileBasedPropertyType(property.type);
}

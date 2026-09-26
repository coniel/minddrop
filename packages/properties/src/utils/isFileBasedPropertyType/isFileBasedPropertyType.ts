import { FileBasedPropertyTypes } from '../../constants';
import { FileBasedPropertyType, PropertyType } from '../../types';

/**
 * Checks whether a property type is file based.
 *
 * @param type - The property type.
 * @returns Whether the property type is file based.
 */
export function isFileBasedPropertyType(
  type: PropertyType,
): type is FileBasedPropertyType {
  return (FileBasedPropertyTypes as PropertyType[]).includes(type);
}

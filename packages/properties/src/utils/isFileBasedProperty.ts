import { FileBasedPropertyTypes } from '../constants';
import { FileBasedPropertySchema, PropertySchema } from '../types';

export function isFileBasedProperty(
  property: PropertySchema,
): property is FileBasedPropertySchema {
  return FileBasedPropertyTypes.includes(property.type);
}

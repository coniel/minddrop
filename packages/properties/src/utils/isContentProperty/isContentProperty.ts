import { ContentPropertySchema } from '../../schemas';
import { PropertySchema } from '../../types';

/**
 * Checks whether a property is a content property.
 *
 * @param property - The property to check.
 * @returns Whether the property is a content property.
 */
export function isContentProperty(
  property: PropertySchema,
): property is ContentPropertySchema {
  return property.type === ContentPropertySchema.type;
}

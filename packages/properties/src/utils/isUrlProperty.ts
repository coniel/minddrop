import { UrlPropertySchema } from '../schemas';
import { PropertySchema } from '../types';

export function isUrlProperty(
  property: PropertySchema,
): property is UrlPropertySchema {
  return property.type === UrlPropertySchema.type;
}

import { PropertySchema, PropertyType } from '../types';
import { CreatedPropertySchema } from './CreatedPropertySchema';
import { DatePropertySchema } from './DatePropertySchema';
import { FormattedTextPropertySchema } from './FormattedTextPropertySchema';
import { IconPropertySchema } from './IconPropertySchema';
import { ImagePropertySchema } from './ImagePropertySchema';
import { LastModifiedPropertySchema } from './LastModifiedPropertySchema';
import { NumberPropertySchema } from './NumberPropertySchema';
import { SelectPropertySchema } from './SelectPropertySchema';
import { TextPropertySchema } from './TextPropertySchema';
import { TogglePropertySchema } from './TogglePropertySchema';
import { UrlPropertySchema } from './UrlPropertySchema';

export * from './CreatedPropertySchema';
export * from './DatePropertySchema';
export * from './IconPropertySchema';
export * from './ImagePropertySchema';
export * from './LastModifiedPropertySchema';
export * from './FormattedTextPropertySchema';
export * from './NumberPropertySchema';
export * from './SelectPropertySchema';
export * from './TextPropertySchema';
export * from './TogglePropertySchema';
export * from './UrlPropertySchema';

export const PropertySchemas: Record<PropertyType, PropertySchema> = {
  text: TextPropertySchema,
  'text-formatted': FormattedTextPropertySchema,
  number: NumberPropertySchema,
  date: DatePropertySchema,
  toggle: TogglePropertySchema,
  select: SelectPropertySchema,
  image: ImagePropertySchema,
  icon: IconPropertySchema,
  url: UrlPropertySchema,
  created: CreatedPropertySchema,
  'last-modified': LastModifiedPropertySchema,
};

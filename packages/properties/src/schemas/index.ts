import { PropertySchemaTemplate, PropertyType } from '../types';
import { CollectionPropertySchema } from './CollectionPropertySchema';
import { ColorPropertySchema } from './ColorPropertySchema';
import { ContentPropertySchema } from './ContentPropertySchema';
import { CreatedPropertySchema } from './CreatedPropertySchema';
import { DatePropertySchema } from './DatePropertySchema';
import { FilePropertySchema } from './FilePropertySchema';
import { IconPropertySchema } from './IconPropertySchema';
import { ImagePropertySchema } from './ImagePropertySchema';
import { LastModifiedPropertySchema } from './LastModifiedPropertySchema';
import { NumberPropertySchema } from './NumberPropertySchema';
import { SelectPropertySchema } from './SelectPropertySchema';
import { TagsPropertySchema } from './TagsPropertySchema';
import { TextPropertySchema } from './TextPropertySchema';
import { TitlePropertySchema } from './TitlePropertySchema';
import { TogglePropertySchema } from './TogglePropertySchema';
import { UrlPropertySchema } from './UrlPropertySchema';

export * from './CollectionPropertySchema';
export * from './ColorPropertySchema';
export * from './ContentPropertySchema';
export * from './CreatedPropertySchema';
export * from './DatePropertySchema';
export * from './FilePropertySchema';
export * from './IconPropertySchema';
export * from './ImagePropertySchema';
export * from './LastModifiedPropertySchema';
export * from './NumberPropertySchema';
export * from './SelectPropertySchema';
export * from './TagsPropertySchema';
export * from './TextPropertySchema';
export * from './TitlePropertySchema';
export * from './TogglePropertySchema';
export * from './UrlPropertySchema';

export const PropertySchemas = {
  title: TitlePropertySchema,
  text: TextPropertySchema,
  content: ContentPropertySchema,
  number: NumberPropertySchema,
  date: DatePropertySchema,
  toggle: TogglePropertySchema,
  select: SelectPropertySchema,
  tags: TagsPropertySchema,
  image: ImagePropertySchema,
  icon: IconPropertySchema,
  url: UrlPropertySchema,
  created: CreatedPropertySchema,
  'last-modified': LastModifiedPropertySchema,
  file: FilePropertySchema,
  collection: CollectionPropertySchema,
  color: ColorPropertySchema,
} satisfies Record<PropertyType, PropertySchemaTemplate>;

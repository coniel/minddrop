import {
  CollectionPropertySchema,
  ColorPropertySchema,
  CreatedPropertySchema,
  DatePropertySchema,
  FilePropertySchema,
  FormattedTextPropertySchema,
  IconPropertySchema,
  ImagePropertySchema,
  LastModifiedPropertySchema,
  NumberPropertySchema,
  SelectPropertySchema,
  TagsPropertySchema,
  TextPropertySchema,
  TitlePropertySchema,
  TogglePropertySchema,
  UrlPropertySchema,
} from '../schemas';

export type PropertySchema =
  | CollectionPropertySchema
  | ColorPropertySchema
  | CreatedPropertySchema
  | DatePropertySchema
  | FormattedTextPropertySchema
  | IconPropertySchema
  | ImagePropertySchema
  | LastModifiedPropertySchema
  | NumberPropertySchema
  | SelectPropertySchema
  | TagsPropertySchema
  | TextPropertySchema
  | TitlePropertySchema
  | TogglePropertySchema
  | UrlPropertySchema
  | FilePropertySchema;

export type PropertiesSchema = PropertySchema[];

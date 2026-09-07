import {
  CollectionPropertySchema,
  ColorPropertySchema,
  ContentPropertySchema,
  CreatedPropertySchema,
  DatePropertySchema,
  FilePropertySchema,
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
  | ContentPropertySchema
  | CreatedPropertySchema
  | DatePropertySchema
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

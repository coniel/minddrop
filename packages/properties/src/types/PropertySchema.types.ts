import {
  AudioPropertySchema,
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
  PdfPropertySchema,
  SelectPropertySchema,
  TagsPropertySchema,
  TextPropertySchema,
  TitlePropertySchema,
  TogglePropertySchema,
  UrlPropertySchema,
  VideoPropertySchema,
} from '../schemas';

export type PropertySchema =
  | CollectionPropertySchema
  | ColorPropertySchema
  | ContentPropertySchema
  | CreatedPropertySchema
  | DatePropertySchema
  | IconPropertySchema
  | AudioPropertySchema
  | ImagePropertySchema
  | LastModifiedPropertySchema
  | NumberPropertySchema
  | PdfPropertySchema
  | SelectPropertySchema
  | TagsPropertySchema
  | TextPropertySchema
  | VideoPropertySchema
  | TitlePropertySchema
  | TogglePropertySchema
  | UrlPropertySchema
  | FilePropertySchema;

export type PropertiesSchema = PropertySchema[];

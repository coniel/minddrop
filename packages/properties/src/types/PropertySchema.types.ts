import {
  CreatedPropertySchema,
  DatePropertySchema,
  FilePropertySchema,
  FormattedTextPropertySchema,
  IconPropertySchema,
  ImagePropertySchema,
  LastModifiedPropertySchema,
  NumberPropertySchema,
  SelectPropertySchema,
  TextPropertySchema,
  TitlePropertySchema,
  TogglePropertySchema,
  UrlPropertySchema,
} from '../schemas';

export type PropertySchema =
  | CreatedPropertySchema
  | DatePropertySchema
  | FormattedTextPropertySchema
  | IconPropertySchema
  | ImagePropertySchema
  | LastModifiedPropertySchema
  | NumberPropertySchema
  | SelectPropertySchema
  | TextPropertySchema
  | TitlePropertySchema
  | TogglePropertySchema
  | UrlPropertySchema
  | FilePropertySchema;

export type PropertiesSchema = PropertySchema[];

export type FileBasedPropertySchema = FilePropertySchema | ImagePropertySchema;

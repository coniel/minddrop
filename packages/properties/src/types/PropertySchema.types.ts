import {
  CreatedPropertySchema,
  DatePropertySchema,
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
  | UrlPropertySchema;

export type PropertiesSchema = PropertySchema[];

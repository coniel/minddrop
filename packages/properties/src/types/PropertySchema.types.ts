import {
  CreatedPropertySchema,
  DatePropertySchema,
  FormatedTextPropertySchema,
  IconPropertySchema,
  ImagePropertySchema,
  LastModifiedPropertySchema,
  NumberPropertySchema,
  SelectPropertySchema,
  TextPropertySchema,
  TogglePropertySchema,
  UrlPropertySchema,
} from '../schemas';

export type PropertySchema =
  | CreatedPropertySchema
  | DatePropertySchema
  | FormatedTextPropertySchema
  | IconPropertySchema
  | ImagePropertySchema
  | LastModifiedPropertySchema
  | NumberPropertySchema
  | SelectPropertySchema
  | TextPropertySchema
  | TogglePropertySchema
  | UrlPropertySchema;

export type PropertiesSchema = PropertySchema[];

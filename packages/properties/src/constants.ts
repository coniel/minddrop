import {
  CreatedPropertySchema,
  LastModifiedPropertySchema,
  TitlePropertySchema,
} from './schemas';
import { FileBasedPropertyType, PropertyType } from './types';

export const FileBasedPropertyTypes: FileBasedPropertyType[] = [
  'image',
  'file',
];

/**
 * Schemas of the properties backed by entry metadata, which every
 * entry has regardless of its database's properties schema.
 */
export const MetadataPropertySchemas = [
  TitlePropertySchema,
  CreatedPropertySchema,
  LastModifiedPropertySchema,
];

/**
 * Property types backed by entry metadata.
 */
export const METADATA_PROPERTY_TYPES = new Set<PropertyType>(
  MetadataPropertySchemas.map((schema) => schema.type),
);

/**
 * Property types whose values can be ordered. Multi-value, file
 * based and content properties have no order to sort on.
 */
export const SORTABLE_PROPERTY_TYPES = new Set<PropertyType>([
  'created',
  'date',
  'last-modified',
  'number',
  'select',
  'text',
  'title',
  'toggle',
  'url',
]);

/**
 * Property types whose values have a text form, listed so that
 * anything rendering a value as text can declare what it accepts.
 * The rest hold content a string cannot carry, such as an icon, a
 * colour or a collection.
 */
export const TEXTUAL_PROPERTY_TYPES: PropertyType[] = [
  'created',
  'date',
  'file',
  'image',
  'last-modified',
  'number',
  'select',
  'text',
  'title',
  'url',
];

/**
 * A [property type]: [file extensions] map of which file extensions
 * are supported by a given property type.
 */
export const FilePropertySupportedFileExtensions: Record<
  FileBasedPropertyType,
  string[]
> = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'],
  file: [],
};

/**
 * A [file extension]: [property type] map of which property type
 * supports a given file extension.
 */
export const FileExtensionToPropertyType = Object.entries(
  FilePropertySupportedFileExtensions,
).reduce(
  (acc, [type, exts]) =>
    Object.assign(acc, Object.fromEntries(exts.map((e) => [e, type]))),
  {} as Record<string, FileBasedPropertyType>,
);

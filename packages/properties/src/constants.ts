import {
  CreatedPropertySchema,
  LastModifiedPropertySchema,
  TitlePropertySchema,
} from './schemas';
import {
  FileBasedPropertyType,
  PropertyFilterOperator,
  PropertyType,
} from './types';

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

// Text comparison operators shared by text-like property types
const TEXT_FILTER_OPERATORS: PropertyFilterOperator[] = [
  'equals',
  'not-equals',
  'contains',
  'not-contains',
  'starts-with',
  'ends-with',
  'is-empty',
  'is-not-empty',
];

// Date comparison operators shared by date-like property types
const DATE_FILTER_OPERATORS: PropertyFilterOperator[] = [
  'is',
  'is-before',
  'is-after',
  'is-on-or-before',
  'is-on-or-after',
];

/**
 * The filter operators available for multiselect select
 * properties.
 */
export const MULTISELECT_PROPERTY_FILTER_OPERATORS: PropertyFilterOperator[] = [
  'contains',
  'not-contains',
  'is-empty',
  'is-not-empty',
];

/**
 * The filter operators available for each property type.
 * Multiselect select properties use
 * MULTISELECT_PROPERTY_FILTER_OPERATORS instead.
 */
export const PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE: Record<
  PropertyType,
  PropertyFilterOperator[]
> = {
  // Title always has a value, no existence operators
  title: [
    'equals',
    'not-equals',
    'contains',
    'not-contains',
    'starts-with',
    'ends-with',
  ],
  text: TEXT_FILTER_OPERATORS,
  content: TEXT_FILTER_OPERATORS,
  url: TEXT_FILTER_OPERATORS,
  // File based properties only support existence tests
  icon: ['is-empty', 'is-not-empty'],
  file: ['is-empty', 'is-not-empty'],
  image: ['is-empty', 'is-not-empty'],
  number: [
    'equals',
    'not-equals',
    'greater-than',
    'greater-than-or-equal',
    'less-than',
    'less-than-or-equal',
    'is-empty',
    'is-not-empty',
  ],
  date: [...DATE_FILTER_OPERATORS, 'is-empty', 'is-not-empty'],
  // Created/last-modified always have a value, no existence
  // operators.
  created: DATE_FILTER_OPERATORS,
  'last-modified': DATE_FILTER_OPERATORS,
  toggle: ['is-true', 'is-false'],
  select: ['is', 'is-not', 'is-empty', 'is-not-empty'],
  // Tags test membership of the picked tags
  tags: [
    'contains-any',
    'contains-all',
    'contains-none',
    'is-empty',
    'is-not-empty',
  ],
  // Color values are not SQL indexed, so color cannot be
  // filtered on yet.
  color: [],
  // Collections test membership of the picked entries
  collection: [
    'contains-any',
    'contains-all',
    'contains-none',
    'is-empty',
    'is-not-empty',
  ],
};

/**
 * Filter operators that do not take a comparison value.
 */
export const VALUE_LESS_PROPERTY_FILTER_OPERATORS =
  new Set<PropertyFilterOperator>([
    'is-empty',
    'is-not-empty',
    'is-true',
    'is-false',
  ]);

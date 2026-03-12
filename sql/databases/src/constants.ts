import type { PropertyType } from '@minddrop/properties';

// SQL exclusion list of property types excluded from the
// full-text index, used in WHERE clauses to filter out
// non-searchable property types
export const EXCLUDED_TYPES_SQL = "'collection'";

// Property types that map to value_text in entry_properties
export const TEXT_PROPERTY_TYPES = new Set<PropertyType>([
  'text',
  'formatted-text',
  'url',
  'icon',
  'file',
  'image',
  'title',
]);

// Property types stored in entry_property_values (multi-value)
export const MULTI_VALUE_PROPERTY_TYPES = new Set<PropertyType>([
  'collection',
  'select',
]);

// Property types that map to value_integer (epoch ms or 0/1)
export const INTEGER_PROPERTY_TYPES = new Set<PropertyType>([
  'toggle',
  'date',
  'created',
  'last-modified',
]);

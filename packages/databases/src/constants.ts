import type { PropertyType } from '@minddrop/properties';
import type { UiIconName } from '@minddrop/ui-icons';

export const DatabaseConfigFileName = 'database.json';
export const MetadataDirName = 'metadata';
export const EntryTemplatesDirName = 'templates';
export const EntryConversionBackupDirName = 'entry-conversion-backup';
export const PropertyFilesDirNameKey = 'databases.propertyFilesDirName';

/**
 * The icon used to represent databases in the UI.
 */
export const DatabasesIcon: UiIconName = 'database';

/**
 * The default icon assigned to newly created databases.
 */
export const DefaultDatabaseIcon = 'content-icon:box:default';

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

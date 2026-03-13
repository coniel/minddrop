import type { PropertyMap, PropertyValue } from '@minddrop/properties';
import { restoreDates } from '@minddrop/utils';
import type { DatabaseEntry, DatabaseEntryMetadata } from '../../types';
import type { SqlEntryRecord } from '../../types';

/**
 * Converts a SqlEntryRecord back to a DatabaseEntry. Inverse
 * of `convertEntryToSqlRecord`.
 */
export function convertSqlRecordToEntry(record: SqlEntryRecord): DatabaseEntry {
  // Reconstruct the properties map from the flat property records
  const properties: PropertyMap = {};

  for (const property of record.properties) {
    properties[property.name] = restorePropertyValue(
      property.type,
      property.value,
    );
  }

  // Parse and restore dates in the metadata JSON
  const metadata = restoreDates<DatabaseEntryMetadata>(
    JSON.parse(record.metadata),
  );

  return {
    id: record.id,
    database: record.databaseId,
    path: record.path,
    title: record.title,
    created: new Date(record.created),
    lastModified: new Date(record.lastModified),
    properties,
    metadata,
  };
}

/**
 * Restores a SQL property value to its original runtime type.
 */
function restorePropertyValue(
  type: string,
  value: string | number | boolean | string[] | null,
): PropertyValue {
  if (value === null) {
    return null;
  }

  // Multi-value types are already string arrays
  if (type === 'select' || type === 'collection') {
    return value;
  }

  // Toggle: stored as 0/1 integer, restore to boolean
  if (type === 'toggle') {
    return value !== 0;
  }

  // Date types: stored as epoch ms, restore to Date
  if (type === 'date' || type === 'created' || type === 'last-modified') {
    return new Date(value as number);
  }

  // Number: already a number
  if (type === 'number') {
    return value;
  }

  // All other types (text, formatted-text, url, icon, file,
  // image, title): stored as string
  return value;
}

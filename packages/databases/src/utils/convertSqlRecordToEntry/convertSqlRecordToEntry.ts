import {
  Properties,
  PropertyMap,
  PropertySchema,
  PropertyValue,
} from '@minddrop/properties';
import { restoreDates } from '@minddrop/utils';
import type {
  Database,
  DatabaseEntry,
  DatabaseEntryId,
  DatabaseEntryMetadata,
  DatabaseId,
} from '../../types';
import type { SqlEntryRecord } from '../../types';

/**
 * Converts a SqlEntryRecord back to a DatabaseEntry. Inverse
 * of `convertEntryToSqlRecord`.
 *
 * @param record - The SQL entry record.
 * @param database - The entry's database, whose schema decides the
 * shape of the restored values.
 * @returns The database entry.
 */
export function convertSqlRecordToEntry(
  record: SqlEntryRecord,
  database: Database,
): DatabaseEntry {
  // Reconstruct the properties map from the flat property records
  const properties: PropertyMap = {};

  for (const property of record.properties) {
    const schema = database.properties.find(
      (candidate) => candidate.name === property.name,
    );

    properties[property.name] = restorePropertyValue(
      property.type,
      property.value,
      schema,
    );
  }

  // Parse and restore dates in the metadata JSON
  const metadata = restoreDates<DatabaseEntryMetadata>(
    JSON.parse(record.metadata),
  );

  return {
    id: record.id as DatabaseEntryId,
    database: record.databaseId as DatabaseId,
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
  schema?: PropertySchema,
): PropertyValue {
  if (value === null) {
    return null;
  }

  // Select values are stored as string arrays whether multiselect
  // or not, so a single select is unwrapped to its value.
  if (type === 'select') {
    const multiselect = schema ? Properties.isMultiselect(schema) : false;

    if (Array.isArray(value) && !multiselect) {
      return value[0] ?? null;
    }

    return value;
  }

  // Multi-value types are already string arrays
  if (type === 'tags' || type === 'collection') {
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

  // All other types (text, content, url, icon, file,
  // image, title): stored as string
  return value;
}

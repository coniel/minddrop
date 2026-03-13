import type { PropertyType } from '@minddrop/properties';
import type { Database, DatabaseEntry } from '../../types';
import type { SqlEntryPropertyRecord, SqlEntryRecord } from '../../types';

/**
 * Converts a DatabaseEntry to a SqlEntryRecord using the
 * database schema for property type information.
 */
export function convertEntryToSqlRecord(
  entry: DatabaseEntry,
  database: Database,
): SqlEntryRecord {
  const properties: SqlEntryPropertyRecord[] = [];

  // Convert each property using the database schema for type info
  for (const schema of database.properties) {
    const value = entry.properties[schema.name];

    if (value === null || value === undefined) {
      continue;
    }

    properties.push({
      name: schema.name,
      type: schema.type,
      value: normalizePropertyValue(schema.type, value),
    });
  }

  return {
    id: entry.id,
    databaseId: entry.database,
    path: entry.path,
    title: entry.title,
    created: entry.created.getTime(),
    lastModified: entry.lastModified.getTime(),
    metadata: JSON.stringify(entry.metadata),
    properties,
  };
}

/**
 * Normalizes a property value for the SQL entry record format.
 */
function normalizePropertyValue(
  type: PropertyType,
  value: unknown,
): string | number | boolean | string[] | null {
  if (value === null || value === undefined) {
    return null;
  }

  // Select and collection properties are stored as string arrays
  if (type === 'collection' || type === 'select') {
    if (Array.isArray(value)) {
      return value.map(String);
    }

    // Single select value, wrap in array
    return [String(value)];
  }

  if (type === 'toggle') {
    return Boolean(value);
  }

  if (type === 'number') {
    return Number(value);
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (type === 'date' || type === 'created' || type === 'last-modified') {
    if (typeof value === 'number') {
      return value;
    }

    return new Date(String(value)).getTime();
  }

  return String(value);
}

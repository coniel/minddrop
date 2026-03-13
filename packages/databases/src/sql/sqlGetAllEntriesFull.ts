import type { PropertyType } from '@minddrop/properties';
import { Sql } from '@minddrop/sql';
import type { SqlEntryPropertyRecord, SqlEntryRecord } from '../types';

/**
 * Retrieves all entries from SQL with their full property data
 * and metadata. Uses three bulk queries (entries, scalar properties,
 * multi-value properties) regardless of entry count, then groups
 * properties by entry ID.
 */
export function sqlGetAllEntriesFull(): SqlEntryRecord[] {
  // Query all entry rows
  const entryRows = Sql.all<{
    id: string;
    database_id: string;
    path: string;
    title: string;
    created: number;
    last_modified: number;
    metadata: string;
  }>(
    'SELECT id, database_id, path, title, created, last_modified, metadata FROM entries',
  );

  // Query all scalar properties
  const scalarRows = Sql.all<{
    entry_id: string;
    property_name: string;
    property_type: PropertyType;
    value_text: string | null;
    value_number: number | null;
    value_integer: number | null;
  }>(
    'SELECT entry_id, property_name, property_type, value_text, value_number, value_integer FROM entry_properties',
  );

  // Query all multi-value properties (select, collection)
  const multiValueRows = Sql.all<{
    entry_id: string;
    property_name: string;
    property_type: PropertyType;
    value_text: string;
  }>(
    'SELECT entry_id, property_name, property_type, value_text FROM entry_property_values',
  );

  // Group scalar properties by entry ID
  const scalarsByEntry = new Map<string, SqlEntryPropertyRecord[]>();

  for (const row of scalarRows) {
    const properties = scalarsByEntry.get(row.entry_id) ?? [];

    properties.push({
      name: row.property_name,
      type: row.property_type,
      value: resolveScalarValue(row),
    });

    scalarsByEntry.set(row.entry_id, properties);
  }

  // Group multi-value properties by entry ID + property name,
  // collecting individual values into arrays
  const multiValuesByEntry = new Map<
    string,
    Map<string, SqlEntryPropertyRecord>
  >();

  for (const row of multiValueRows) {
    const entryMap =
      multiValuesByEntry.get(row.entry_id) ??
      new Map<string, SqlEntryPropertyRecord>();

    const existing = entryMap.get(row.property_name);

    if (existing && Array.isArray(existing.value)) {
      existing.value.push(row.value_text);
    } else {
      entryMap.set(row.property_name, {
        name: row.property_name,
        type: row.property_type,
        value: [row.value_text],
      });
    }

    multiValuesByEntry.set(row.entry_id, entryMap);
  }

  // Assemble full entry records
  return entryRows.map((row) => {
    const scalars = scalarsByEntry.get(row.id) ?? [];
    const multiValues = multiValuesByEntry.get(row.id);
    const multiValueProperties = multiValues ? [...multiValues.values()] : [];

    return {
      id: row.id,
      databaseId: row.database_id,
      path: row.path,
      title: row.title,
      created: row.created,
      lastModified: row.last_modified,
      metadata: row.metadata,
      properties: [...scalars, ...multiValueProperties],
    };
  });
}

/**
 * Resolves the value from a scalar property row, picking the
 * appropriate column based on which is non-null.
 */
function resolveScalarValue(row: {
  value_text: string | null;
  value_number: number | null;
  value_integer: number | null;
}): string | number | boolean | null {
  if (row.value_text !== null) {
    return row.value_text;
  }

  if (row.value_number !== null) {
    return row.value_number;
  }

  if (row.value_integer !== null) {
    return row.value_integer;
  }

  return null;
}

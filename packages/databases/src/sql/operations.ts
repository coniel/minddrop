import { Sql } from '@minddrop/sql';
import type { SqlOperation } from '@minddrop/sql';
import {
  EXCLUDED_TYPES_SQL,
  INTEGER_PROPERTY_TYPES,
  MULTI_VALUE_PROPERTY_TYPES,
  TEXT_PROPERTY_TYPES,
} from '../constants';
import type { SqlEntryPropertyRecord, SqlEntryRecord } from '../types';

/**
 * Upserts a database record into the databases table.
 */
export function upsertDatabase(databaseData: {
  id: string;
  name: string;
  path: string;
  icon: string;
}): void {
  Sql.run(
    'INSERT OR REPLACE INTO databases (id, name, path, icon) VALUES (?, ?, ?, ?)',
    databaseData.id,
    databaseData.name,
    databaseData.path,
    databaseData.icon,
  );
}

/**
 * Deletes a database record from the databases table.
 */
export function deleteDatabase(databaseId: string): void {
  Sql.run('DELETE FROM databases WHERE id = ?', databaseId);
}

/**
 * Renames a property across all entries in a database.
 * Updates both the entry_properties and entry_property_values
 * tables in a single transaction.
 */
export function renameProperty(
  databaseId: string,
  oldName: string,
  newName: string,
): void {
  Sql.transaction([
    // Rename in the scalar properties table
    {
      sql: `UPDATE entry_properties SET property_name = ?
         WHERE property_name = ?
         AND entry_id IN (SELECT id FROM entries WHERE database_id = ?)`,
      params: [newName, oldName, databaseId],
    },
    // Rename in the multi-value properties table
    {
      sql: `UPDATE entry_property_values SET property_name = ?
         WHERE property_name = ?
         AND entry_id IN (SELECT id FROM entries WHERE database_id = ?)`,
      params: [newName, oldName, databaseId],
    },
    // Increment the version counter
    {
      sql: "UPDATE meta SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT) WHERE key = 'version'",
      params: [],
    },
  ]);
}

/**
 * Retrieves a database name by its ID.
 */
export function getDatabaseName(databaseId: string): string | null {
  const row = Sql.get<{ name: string }>(
    'SELECT name FROM databases WHERE id = ?',
    databaseId,
  );

  return row?.name ?? null;
}

/**
 * Retrieves a database's icon by its ID.
 */
export function getDatabaseIcon(databaseId: string): string {
  const row = Sql.get<{ icon: string }>(
    'SELECT icon FROM databases WHERE id = ?',
    databaseId,
  );

  return row?.icon ?? '';
}

/**
 * Upserts one or more entries into the SQL database.
 * Uses a transaction for bulk operations.
 */
export function upsertEntries(entries: SqlEntryRecord[]): void {
  const operations: SqlOperation[] = [];

  for (const entry of entries) {
    // Upsert the entry row
    operations.push({
      sql: `INSERT OR REPLACE INTO entries (id, database_id, path, title, created, last_modified)
     VALUES (?, ?, ?, ?, ?, ?)`,
      params: [
        entry.id,
        entry.databaseId,
        entry.path,
        entry.title,
        entry.created,
        entry.lastModified,
      ],
    });

    // Clear existing properties for this entry
    operations.push({
      sql: 'DELETE FROM entry_properties WHERE entry_id = ?',
      params: [entry.id],
    });

    operations.push({
      sql: 'DELETE FROM entry_property_values WHERE entry_id = ?',
      params: [entry.id],
    });

    // Insert new properties
    for (const property of entry.properties) {
      operations.push(...buildPropertyInsertOps(entry.id, property));
    }
  }

  // Increment the version counter
  operations.push({
    sql: "UPDATE meta SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT) WHERE key = 'version'",
    params: [],
  });

  Sql.transaction(operations);
}

/**
 * Deletes one or more entries from the SQL database.
 * CASCADE takes care of cleaning up related property rows.
 */
export function deleteEntries(entryIds: string[]): void {
  Sql.transaction([
    ...entryIds.map((id) => ({
      sql: 'DELETE FROM entries WHERE id = ?',
      params: [id],
    })),
    {
      sql: "UPDATE meta SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT) WHERE key = 'version'",
      params: [],
    },
  ]);
}

/**
 * Returns the current version counter.
 */
export function getVersion(): number {
  const row = Sql.get<{ value: string }>(
    "SELECT value FROM meta WHERE key = 'version'",
  );

  return row ? parseInt(row.value, 10) : 0;
}

/**
 * Retrieves all entries as summary objects, used for
 * building the MiniSearch index.
 */
export function getAllEntries(): {
  id: string;
  databaseId: string;
  title: string;
}[] {
  return Sql.all<{ id: string; databaseId: string; title: string }>(
    'SELECT id, database_id as databaseId, title FROM entries',
  );
}

/**
 * Retrieves all text content for a given entry, used for
 * building the MiniSearch full-text index.
 */
export function getEntryTextContent(entryId: string): {
  textValues: string[];
  propertyValues: string[];
} {
  // Get text properties (for the "content" field)
  const textRows = Sql.all<{ value_text: string | null }>(
    "SELECT value_text FROM entry_properties WHERE entry_id = ? AND property_type IN ('text', 'formatted-text')",
    entryId,
  );

  // Get other scalar property values (for the "properties" field).
  // Excluded property types are not part of the full-text index.
  const propertyRows = Sql.all<{ value_text: string | null }>(
    `SELECT value_text FROM entry_properties WHERE entry_id = ? AND property_type NOT IN ('text', 'formatted-text', ${EXCLUDED_TYPES_SQL})`,
    entryId,
  );

  // Get multi-value property values (select options, collection
  // references) for the full-text index
  const multiValueRows = Sql.all<{ value_text: string }>(
    'SELECT value_text FROM entry_property_values WHERE entry_id = ?',
    entryId,
  );

  const textValues = textRows
    .map((row) => row.value_text)
    .filter((value): value is string => value !== null);

  const propertyValues = [
    ...propertyRows
      .map((row) => row.value_text)
      .filter((value): value is string => value !== null),
    ...multiValueRows.map((row) => row.value_text),
  ];

  return { textValues, propertyValues };
}

/**
 * Retrieves all databases.
 */
export function getAllDatabases(): {
  id: string;
  name: string;
  path: string;
  icon: string;
}[] {
  return Sql.all<{
    id: string;
    name: string;
    path: string;
    icon: string;
  }>('SELECT id, name, path, icon FROM databases');
}

/**
 * Returns a map of entry ID to last_modified timestamp for all
 * entries in the given database. Used to diff against fresh file
 * reads and skip unchanged entries on startup.
 */
export function getEntryTimestamps(databaseId: string): Map<string, number> {
  const rows = Sql.all<{ id: string; last_modified: number }>(
    'SELECT id, last_modified FROM entries WHERE database_id = ?',
    databaseId,
  );

  return new Map(rows.map((row) => [row.id, row.last_modified]));
}

/**
 * Retrieves all text-searchable property name-value pairs for
 * an entry. Used for finding which properties matched a search
 * query. Includes text properties, collection values, and
 * select/url/etc. properties.
 */
export function getEntryPropertyValues(
  entryId: string,
): { name: string; value: string; type: string }[] {
  // Get scalar properties (excluded types are not part of
  // the full-text index)
  const scalarRows = Sql.all<{
    property_name: string;
    property_type: string;
    value_text: string;
  }>(
    `SELECT property_name, property_type, value_text FROM entry_properties WHERE entry_id = ? AND value_text IS NOT NULL AND property_type NOT IN (${EXCLUDED_TYPES_SQL})`,
    entryId,
  );

  // Get multi-value properties (select, collection) that are
  // not excluded from the full-text index
  const multiValueRows = Sql.all<{
    property_name: string;
    property_type: string;
    value_text: string;
  }>(
    `SELECT property_name, property_type, value_text FROM entry_property_values WHERE entry_id = ? AND property_type NOT IN (${EXCLUDED_TYPES_SQL})`,
    entryId,
  );

  return [
    ...scalarRows.map((row) => ({
      name: row.property_name,
      value: row.value_text,
      type: row.property_type,
    })),
    ...multiValueRows.map((row) => ({
      name: row.property_name,
      value: row.value_text,
      type: row.property_type,
    })),
  ];
}

/**
 * Builds SQL insert operations for a single property value.
 * Routes to the appropriate table based on the property type.
 */
function buildPropertyInsertOps(
  entryId: string,
  property: SqlEntryPropertyRecord,
): SqlOperation[] {
  // Skip null values
  if (property.value === null) {
    return [];
  }

  // Multi-value properties (select, collection) go into
  // the entry_property_values table
  if (
    MULTI_VALUE_PROPERTY_TYPES.has(property.type) &&
    Array.isArray(property.value)
  ) {
    return property.value.map((value) => ({
      sql: `INSERT INTO entry_property_values (entry_id, property_name, property_type, value_text)
     VALUES (?, ?, ?, ?)`,
      params: [entryId, property.name, property.type, value],
    }));
  }

  // Determine which value column to use
  let valueText: string | null = null;
  let valueNumber: number | null = null;
  let valueInteger: number | null = null;

  if (TEXT_PROPERTY_TYPES.has(property.type)) {
    valueText = String(property.value);
  } else if (property.type === 'number') {
    valueNumber = Number(property.value);
  } else if (INTEGER_PROPERTY_TYPES.has(property.type)) {
    // Toggle: boolean -> 0/1, dates: epoch ms
    if (typeof property.value === 'boolean') {
      valueInteger = property.value ? 1 : 0;
    } else {
      valueInteger = Number(property.value);
    }
  }

  return [
    {
      sql: `INSERT INTO entry_properties (entry_id, property_name, property_type, value_text, value_number, value_integer)
     VALUES (?, ?, ?, ?, ?, ?)`,
      params: [
        entryId,
        property.name,
        property.type,
        valueText,
        valueNumber,
        valueInteger,
      ],
    },
  ];
}

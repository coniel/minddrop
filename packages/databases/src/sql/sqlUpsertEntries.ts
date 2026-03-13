import { Events } from '@minddrop/events';
import { Sql } from '@minddrop/sql';
import type { SqlOperation } from '@minddrop/sql';
import {
  INTEGER_PROPERTY_TYPES,
  MULTI_VALUE_PROPERTY_TYPES,
  TEXT_PROPERTY_TYPES,
} from '../constants';
import { DatabaseEntriesSqlSyncedEvent } from '../events';
import type { DatabaseEntriesSqlSyncedEventData } from '../events';
import type { SqlEntryPropertyRecord, SqlEntryRecord } from '../types';

/**
 * Upserts one or more entries into the SQL database.
 * Uses a transaction for bulk operations and dispatches
 * a DatabaseEntriesSqlSyncedEvent.
 */
export function sqlUpsertEntries(
  databaseId: string,
  entries: SqlEntryRecord[],
  options?: { silent?: boolean },
): void {
  const operations: SqlOperation[] = [];

  for (const entry of entries) {
    // Upsert the entry row
    operations.push({
      sql: `INSERT OR REPLACE INTO entries (id, database_id, path, title, created, last_modified, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [
        entry.id,
        entry.databaseId,
        entry.path,
        entry.title,
        entry.created,
        entry.lastModified,
        entry.metadata,
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

  // Dispatch SQL synced event unless silenced
  if (!options?.silent) {
    Events.dispatch<DatabaseEntriesSqlSyncedEventData>(
      DatabaseEntriesSqlSyncedEvent,
      {
        action: 'upsert',
        entryIds: entries.map((entry) => entry.id),
        databaseId,
        entries,
      },
    );
  }
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

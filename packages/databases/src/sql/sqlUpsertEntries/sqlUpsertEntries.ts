import { Events } from '@minddrop/events';
import { Sql } from '@minddrop/sql';
import type { SqlOperation } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import {
  INTEGER_PROPERTY_TYPES,
  MULTI_VALUE_PROPERTY_TYPES,
  TEXT_PROPERTY_TYPES,
} from '../../constants';
import { EntriesSqlSyncedEvent } from '../../events';
import type {
  EntryReference,
  SqlEntryPropertyRecord,
  SqlEntryRecord,
} from '../../types';
import {
  resolveEntryPropertyReferences,
  resolveWikilinkReferenceKey,
} from '../../utils';

/**
 * Upserts one or more entries into the SQL database in a single
 * transaction.
 *
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 *
 * @dispatches databases:entries:sql-synced
 */
export function sqlUpsertEntries(
  databaseId: string,
  entries: SqlEntryRecord[],
  options?: { silent?: boolean },
  workspaceId?: string,
): void {
  const operations: SqlOperation[] = [];

  for (const entry of entries) {
    // Upsert the entry row
    operations.push({
      sql: `INSERT OR REPLACE INTO entries (id, database_id, path, title, created, last_modified, content_hash, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        entry.id,
        entry.databaseId,
        entry.path,
        entry.title,
        entry.created,
        entry.lastModified,
        entry.contentHash,
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

    // Insert the entry's references. Its existing references were
    // removed with the entry row it replaced.
    for (const reference of resolveEntryPropertyReferences(
      entry.id,
      entry.properties,
    )) {
      operations.push(buildReferenceInsertOperation(reference));
    }
  }

  // Increment the version counter
  operations.push({
    sql: "UPDATE meta SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT) WHERE key = 'version'",
    params: [],
  });

  Sql.transaction(workspaceId ?? Workspaces.getActive().id, operations);

  // Dispatch SQL synced event unless silenced
  if (!options?.silent) {
    Events.dispatch(EntriesSqlSyncedEvent, {
      action: 'upsert',
      entryIds: entries.map((entry) => entry.id),
      databaseId,
      entries,
    });
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
  // the entry_property_values table.
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

/**
 * Builds the SQL insert operation for an entry reference.
 *
 * @param reference - The reference to insert.
 * @returns The insert operation.
 */
function buildReferenceInsertOperation(
  reference: EntryReference,
): SqlOperation {
  // The insert statement shared by both kinds of reference
  const sql = `INSERT INTO entry_references (entry_id, kind, property_name, target_entry_id, target_reference, target_key, fragment)
     VALUES (?, ?, ?, ?, ?, ?, ?)`;

  // Insert a property reference with its target entry ID
  if (reference.kind === 'property') {
    return {
      sql,
      params: [
        reference.entryId,
        reference.kind,
        reference.propertyName,
        reference.targetEntryId,
        null,
        null,
        null,
      ],
    };
  }

  // Insert a wikilink with its reference key as its target key
  return {
    sql,
    params: [
      reference.entryId,
      reference.kind,
      null,
      null,
      reference.reference,
      resolveWikilinkReferenceKey(reference.reference),
      reference.fragment ?? null,
    ],
  };
}

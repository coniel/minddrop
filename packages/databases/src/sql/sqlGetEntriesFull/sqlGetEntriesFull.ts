import type { PropertyType } from '@minddrop/properties';
import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import type { SqlEntryPropertyRecord, SqlEntryRecord } from '../../types';

// The most entry IDs bound to one query, kept well under SQLite's
// limit on query parameters.
const MaxIdsPerQuery = 10000;

export interface SqlGetEntriesFullOptions {
  /**
   * The IDs of the entries to retrieve. Defaults to all entries.
   */
  entryIds?: string[];

  /**
   * The ID of the workspace whose database to target. Defaults to
   * the active workspace.
   */
  workspaceId?: string;
}

/**
 * Retrieves entries from SQL with their full property data and
 * metadata.
 *
 * @param options - Retrieval options.
 * @returns The entries' full SQL records.
 */
export function sqlGetEntriesFull(
  options: SqlGetEntriesFullOptions = {},
): SqlEntryRecord[] {
  const { entryIds, workspaceId } = options;

  // Resolve the target workspace
  const targetWorkspaceId = workspaceId ?? Workspaces.getActive().id;

  // Return no entries for an empty ID list, rather than querying an
  // empty IN list.
  if (entryIds?.length === 0) {
    return [];
  }

  // Split ID lists too long to bind to one query
  if (entryIds && entryIds.length > MaxIdsPerQuery) {
    return [
      ...sqlGetEntriesFull({
        entryIds: entryIds.slice(0, MaxIdsPerQuery),
        workspaceId,
      }),
      ...sqlGetEntriesFull({
        entryIds: entryIds.slice(MaxIdsPerQuery),
        workspaceId,
      }),
    ];
  }

  // Restrict each query to the given entries, if any
  const placeholders = entryIds?.map(() => '?').join(', ');
  const entryFilter = entryIds ? ` WHERE id IN (${placeholders})` : '';
  const propertyFilter = entryIds ? ` WHERE entry_id IN (${placeholders})` : '';
  const params = entryIds ?? [];

  // Query the entry rows
  const entryRows = Sql.all<{
    id: string;
    database_id: string;
    path: string;
    title: string;
    created: number;
    last_modified: number;
    content_hash: string;
    metadata: string;
  }>(
    targetWorkspaceId,
    `SELECT id, database_id, path, title, created, last_modified, content_hash, metadata FROM entries${entryFilter}`,
    ...params,
  );

  // Query the scalar properties
  const scalarRows = Sql.all<{
    entry_id: string;
    property_name: string;
    property_type: PropertyType;
    value_text: string | null;
    value_number: number | null;
    value_integer: number | null;
  }>(
    targetWorkspaceId,
    `SELECT entry_id, property_name, property_type, value_text, value_number, value_integer FROM entry_properties${propertyFilter}`,
    ...params,
  );

  // Query the multi-value properties (select, collection)
  const multiValueRows = Sql.all<{
    entry_id: string;
    property_name: string;
    property_type: PropertyType;
    value_text: string;
  }>(
    targetWorkspaceId,
    `SELECT entry_id, property_name, property_type, value_text FROM entry_property_values${propertyFilter}`,
    ...params,
  );

  // Group scalar properties by entry ID
  const scalarsByEntry = new Map<string, SqlEntryPropertyRecord[]>();

  for (const row of scalarRows) {
    // Get the entry's properties grouped so far
    const properties = scalarsByEntry.get(row.entry_id) ?? [];

    // Add the property
    properties.push({
      name: row.property_name,
      type: row.property_type,
      value: resolveScalarValue(row),
    });

    // Store the entry's properties
    scalarsByEntry.set(row.entry_id, properties);
  }

  // Group multi-value properties by entry ID and property name. Each
  // property's values are collected into an array.
  const multiValuesByEntry = new Map<
    string,
    Map<string, SqlEntryPropertyRecord>
  >();

  for (const row of multiValueRows) {
    // Get the entry's properties grouped so far
    const entryMap =
      multiValuesByEntry.get(row.entry_id) ??
      new Map<string, SqlEntryPropertyRecord>();

    // Get the property's record, if one was started
    const existing = entryMap.get(row.property_name);

    if (existing && Array.isArray(existing.value)) {
      // Add the value to the property's existing values
      existing.value.push(row.value_text);
    } else {
      // Start the property's record with the value
      entryMap.set(row.property_name, {
        name: row.property_name,
        type: row.property_type,
        value: [row.value_text],
      });
    }

    // Store the entry's properties
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
      contentHash: row.content_hash,
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

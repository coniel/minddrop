import { Sql } from '@minddrop/sql';
import type { SqlParam } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import { EXCLUDED_TYPES_SQL } from '../../constants';

export interface SqlGetEntryShortPropertyValuesOptions {
  /**
   * The IDs of the entries to read. Reads every entry when omitted.
   */
  entryIds?: string[];

  /**
   * The ID of the database to limit the read to.
   */
  databaseId?: string;
}

/**
 * Retrieves the short text property values of entries, keyed by
 * entry ID. Text and content property values are left out.
 *
 * @param options - The entries to read.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 * @returns Each entry's short property values. Entries without any are left out.
 */
export function sqlGetEntryShortPropertyValues(
  options: SqlGetEntryShortPropertyValuesOptions = {},
  workspaceId?: string,
): Map<string, string[]> {
  // Build the filters for the requested entries
  const filters: string[] = [];
  const params: SqlParam[] = [];

  // Limit the read to the given entries. The IDs are passed as one
  // JSON array, so any number of them fits in one parameter.
  if (options.entryIds) {
    filters.push('AND entry_id IN (SELECT value FROM json_each(?))');
    params.push(JSON.stringify(options.entryIds));
  }

  // Limit the read to the given database's entries
  if (options.databaseId) {
    filters.push(
      'AND entry_id IN (SELECT id FROM entries WHERE database_id = ?)',
    );
    params.push(options.databaseId);
  }

  // Join the filters into one clause
  const filter = filters.join(' ');

  // Read the scalar values other than text, content and the excluded
  // property types. Then read the multi-value values, select options
  // and collection references alike.
  const rows = Sql.all<{ entry_id: string; value_text: string }>(
    workspaceId ?? Workspaces.getActive().id,
    `SELECT entry_id, value_text FROM entry_properties
     WHERE value_text IS NOT NULL
       AND property_type NOT IN ('text', 'content', ${EXCLUDED_TYPES_SQL})
       ${filter}
     UNION ALL
     SELECT entry_id, value_text FROM entry_property_values
     WHERE 1 ${filter}`,
    ...params,
    ...params,
  );

  // Group the values by entry
  const values = new Map<string, string[]>();

  for (const row of rows) {
    const entryValues = values.get(row.entry_id);

    // Append to the entry's values, or start its list
    if (entryValues) {
      entryValues.push(row.value_text);
    } else {
      values.set(row.entry_id, [row.value_text]);
    }
  }

  return values;
}

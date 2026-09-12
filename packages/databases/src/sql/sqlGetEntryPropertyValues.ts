import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import { EXCLUDED_TYPES_SQL } from '../constants';

/**
 * Retrieves all text-searchable property name-value pairs for
 * an entry. Used for finding which properties matched a search
 * query. Includes text properties, collection values, and
 * select/url/etc. properties.
 *
 * @param entryId - The ID of the entry.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 */
export function sqlGetEntryPropertyValues(
  entryId: string,
  workspaceId?: string,
): { name: string; value: string; type: string }[] {
  const targetWorkspaceId = workspaceId ?? Workspaces.getActive().id;

  // Get scalar properties (excluded types are not part of
  // the full-text index)
  const scalarRows = Sql.all<{
    property_name: string;
    property_type: string;
    value_text: string;
  }>(
    targetWorkspaceId,
    `SELECT property_name, property_type, value_text FROM entry_properties WHERE entry_id = ? AND value_text IS NOT NULL AND property_type NOT IN (${EXCLUDED_TYPES_SQL})`,
    entryId,
  );

  // Get multi-value properties (select, collection) that are
  // not excluded from the full-text index.
  const multiValueRows = Sql.all<{
    property_name: string;
    property_type: string;
    value_text: string;
  }>(
    targetWorkspaceId,
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

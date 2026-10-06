import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import { EntryReference, SqlEntryReferenceRow } from '../../types';
import {
  convertSqlReferenceRowToReference,
  resolveWikilinkReferenceKey,
} from '../../utils';

/**
 * Retrieves the references entries have to an entry: collection values
 * containing its ID, and wikilinks written as any of the given
 * references, matched regardless of case.
 *
 * @param entryId - The ID of the referenced entry.
 * @param wikilinkReferences - The references a wikilink can name the entry by, e.g. its title and its address.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 * @returns The references, in the order they were indexed.
 */
export async function sqlGetReferencesToEntry(
  entryId: string,
  wikilinkReferences: string[],
  workspaceId?: string,
): Promise<EntryReference[]> {
  // Resolve the keys the wikilinks to the entry are indexed by
  const keys = wikilinkReferences.map(resolveWikilinkReferenceKey);

  // Read the references to the entry by its ID or by a wikilink key
  const rows = await Sql.all<SqlEntryReferenceRow>(
    workspaceId ?? Workspaces.getActive().id,
    `SELECT entry_id, kind, property_name, target_entry_id, target_reference, fragment
     FROM entry_references
     WHERE target_entry_id = ? OR target_key IN (${keys.map(() => '?').join(', ')})
     ORDER BY rowid`,
    entryId,
    ...keys,
  );

  // Convert the rows to references
  return rows.map(convertSqlReferenceRowToReference);
}

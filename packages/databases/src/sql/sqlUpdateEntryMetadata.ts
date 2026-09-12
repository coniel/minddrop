import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import type { DatabaseEntryMetadata } from '../types';

/**
 * Updates the metadata column for a single entry in the SQL database.
 *
 * @param entryId - The ID of the entry to update.
 * @param metadata - The new metadata to serialize and store.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 */
export function sqlUpdateEntryMetadata(
  entryId: string,
  metadata: DatabaseEntryMetadata,
  workspaceId?: string,
): void {
  Sql.run(
    workspaceId ?? Workspaces.getActive().id,
    'UPDATE entries SET metadata = ? WHERE id = ?',
    JSON.stringify(metadata),
    entryId,
  );
}

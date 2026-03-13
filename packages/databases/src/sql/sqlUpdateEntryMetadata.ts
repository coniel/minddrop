import { Sql } from '@minddrop/sql';
import type { DatabaseEntryMetadata } from '../types';

/**
 * Updates the metadata column for a single entry in the SQL database.
 *
 * @param entryId - The ID of the entry to update.
 * @param metadata - The new metadata to serialize and store.
 */
export function sqlUpdateEntryMetadata(
  entryId: string,
  metadata: DatabaseEntryMetadata,
): void {
  Sql.run('UPDATE entries SET metadata = ? WHERE id = ?', [
    JSON.stringify(metadata),
    entryId,
  ]);
}

import { titleFromPath } from '@minddrop/utils';
import { resolveEntryAddressKey } from '../../utils';
import { sqlGetAllDatabases } from '../sqlGetAllDatabases';
import { sqlGetEntrySyncRecords } from '../sqlGetEntrySyncRecords';

/**
 * Indexes the IDs of every indexed entry in a workspace by their
 * address key.
 *
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 * @returns The entry IDs, keyed by address key.
 */
export function sqlGetEntryIdsByAddress(
  workspaceId?: string,
): Map<string, string> {
  // Entry IDs, keyed by address key
  const entryIdByAddress = new Map<string, string>();

  // Index each database's records by the address of their title
  sqlGetAllDatabases(workspaceId).forEach((database) => {
    sqlGetEntrySyncRecords(database.id, workspaceId).forEach((record) => {
      entryIdByAddress.set(
        resolveEntryAddressKey({ title: titleFromPath(record.path) }, database),
        record.id,
      );
    });
  });

  return entryIdByAddress;
}

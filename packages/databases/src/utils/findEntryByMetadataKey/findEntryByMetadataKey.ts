import { getAllEntries } from '../../getAllEntries';
import { Entry } from '../../types';
import { resolveEntryMetadataKey } from '../resolveEntryMetadataKey';

/**
 * Finds the entry of a database whose metadata sidecar is keyed by
 * the given key.
 *
 * @param databaseId - The ID of the database to search.
 * @param metadataKey - The sidecar's metadata key.
 * @param workspaceId - The ID of the workspace the database is in. Defaults to the active workspace.
 * @returns The entry, or null if no entry owns the sidecar.
 */
export function findEntryByMetadataKey(
  databaseId: string,
  metadataKey: string,
  workspaceId?: string,
): Entry | null {
  return (
    getAllEntries(databaseId, workspaceId).find(
      (entry) => resolveEntryMetadataKey(entry.path) === metadataKey,
    ) ?? null
  );
}

import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { databaseEntryAddress } from '../databaseEntryAddress';

/**
 * Converts entry IDs into durable workspace-relative addresses.
 * IDs that do not resolve to an entry are dropped.
 *
 * @param entryIds - The entry IDs to convert.
 * @returns The entry addresses in the same order.
 */
export function entryIdsToAddresses(entryIds: string[]): string[] {
  return entryIds.flatMap((entryId) => {
    // Look up the entry to get its current path
    const entry = DatabaseEntriesStore.get(entryId);

    // Drop IDs that no longer resolve
    if (!entry) {
      return [];
    }

    return [databaseEntryAddress(entry.path)];
  });
}

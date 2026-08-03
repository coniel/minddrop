import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { databaseEntryPathFromAddress } from '../databaseEntryPathFromAddress';

/**
 * Resolves durable workspace-relative addresses into entry IDs.
 * Addresses that do not resolve to an entry are dropped.
 *
 * @param addresses - The entry addresses to resolve.
 * @returns The entry IDs in the same order.
 */
export function addressesToEntryIds(addresses: string[]): string[] {
  // Index the store's entries by path
  const entryIdByPath = new Map(
    DatabaseEntriesStore.getAllArray().map((entry) => [entry.path, entry.id]),
  );

  return addresses.flatMap((address) => {
    // Resolve the address to an entry ID via its path
    const entryId = entryIdByPath.get(databaseEntryPathFromAddress(address));

    // Drop addresses that no longer resolve
    if (!entryId) {
      return [];
    }

    return [entryId];
  });
}

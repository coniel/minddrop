import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { databaseEntryAddress } from '../databaseEntryAddress';

/**
 * Serializes an entry ID into the entry's durable
 * workspace-relative address.
 *
 * @param id - The entry ID to serialize.
 * @returns The entry address, or null if the entry does not exist.
 */
export function serializeDatabaseEntryReference(id: string): string | null {
  // Look up the entry to get its current path
  const entry = DatabaseEntriesStore.get(id);

  // IDs that do not resolve cannot be serialized
  if (!entry) {
    return null;
  }

  return databaseEntryAddress(entry.path);
}

import { EntriesStore } from '../EntriesStore';
import { EntryNotFoundError } from '../errors';
import { Entry } from '../types';

/**
 * Retrieves a database entry by its ID.
 *
 * @param id - The ID of the entry to retrieve.
 * @param throwOnNotFound - Whether to throw when the entry does not exist. Defaults to true.
 * @param workspaceId - The workspace the entry belongs to. Omit for the active workspace.
 * @returns The retrieved entry, or null when not found and not throwing.
 *
 * @throws {EntryNotFoundError} If the entry does not exist and throwing is enabled.
 */
export function getEntry<TEntry extends Entry = Entry>(
  id: string,
  throwOnNotFound?: true,
  workspaceId?: string,
): TEntry;
export function getEntry<TEntry extends Entry = Entry>(
  id: string,
  throwOnNotFound: false,
  workspaceId?: string,
): TEntry | null;
export function getEntry<TEntry extends Entry = Entry>(
  id: string,
  throwOnNotFound = true,
  workspaceId?: string,
): TEntry | null {
  // Get the entry from the workspace's store record
  const entry = EntriesStore.in(workspaceId).get(id);

  // Handle the entry not existing
  if (!entry) {
    if (throwOnNotFound) {
      throw new EntryNotFoundError(id);
    }

    return null;
  }

  return entry as TEntry;
}

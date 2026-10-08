import { orderByCreated } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';

/**
 * Normalizes one of the database config's ordered ID lists against
 * the resources actually found on disk, updating the store when the
 * list changed. Resources missing from the list are appended sorted by
 * creation date, oldest first.
 *
 * Only updates the in-memory store, never the config file: the
 * found resources may be mid-sync (e.g. a resource file delivered before
 * the config listing it), so writing the reconciled list to disk
 * would conflict with the incoming config. The persisted list
 * catches up on the next genuine config mutation.
 *
 * @param databaseId - The ID of the database whose config to normalize.
 * @param key - The config list to normalize.
 * @param resources - The resources found on disk.
 * @param workspaceId - The ID of the workspace the database belongs to.
 * @param retainedIds - The IDs of resources whose files exist but could not be read. Kept in the list as if found.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export function normalizeDatabaseConfigIds(
  databaseId: string,
  key: 'views' | 'designs' | 'entryTemplates',
  resources: { id: string; created: Date }[],
  workspaceId: string,
  retainedIds: string[] = [],
): void {
  const store = DatabasesStore.in(workspaceId);

  // Get the database from the workspace's store record
  const database = store.get(databaseId);

  if (!database) {
    throw new DatabaseNotFoundError(databaseId);
  }

  // IDs of the resources found on disk
  const foundIds = new Set(resources.map((resource) => resource.id));
  // IDs of the resources which could not be read
  const retained = new Set(retainedIds);
  // IDs in the config's list
  const listedIds = new Set(database[key]);

  // Reconcile the config's list against the resources found on disk
  const normalized = [
    // The listed IDs of found and retained resources, in listed order
    ...database[key].filter((id) => foundIds.has(id) || retained.has(id)),
    // The found resources missing from the list, oldest first
    ...resources
      .filter((resource) => !listedIds.has(resource.id))
      .sort(orderByCreated)
      .map((resource) => resource.id),
  ];

  // Leave the store untouched when the list is already normalized
  if (
    normalized.length === database[key].length &&
    normalized.every((id, index) => id === database[key][index])
  ) {
    return;
  }

  // Update the database in the workspace's store record
  store.update(databaseId, { [key]: normalized });
}

import { orderByCreated, reconcileIdOrder } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';

/**
 * Normalizes one of the database config's ordered ID lists against
 * the items actually found on disk, updating the store when the
 * list changed. Items missing from the list are appended sorted by
 * creation date, oldest first.
 *
 * Only updates the in-memory store, never the config file: the
 * found items may be mid-sync (e.g. an item file delivered before
 * the config listing it), so writing the reconciled list to disk
 * would conflict with the incoming config. The persisted list
 * catches up on the next genuine config mutation.
 *
 * @param databaseId - The ID of the database whose config to normalize.
 * @param key - The config list to normalize.
 * @param items - The items found on disk.
 * @param workspaceId - The ID of the workspace the database belongs to.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export function normalizeDatabaseConfigIds(
  databaseId: string,
  key: 'views' | 'designs' | 'entryTemplates',
  items: { id: string; created: Date }[],
  workspaceId: string,
): void {
  const store = DatabasesStore.in(workspaceId);

  // Get the database from the workspace's store record
  const database = store.get(databaseId);

  if (!database) {
    throw new DatabaseNotFoundError(databaseId);
  }

  // Reconcile the config's list against the items found on disk
  const normalized = reconcileIdOrder(database[key], items, orderByCreated).map(
    (item) => item.id,
  );

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

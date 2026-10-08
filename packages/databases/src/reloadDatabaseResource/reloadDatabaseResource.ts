import { normalizeDatabaseConfigIds } from '../normalizeDatabaseConfigIds';
import { DatabaseFileReadResult } from '../types';

export interface ReloadDatabaseResourceOptions<TResource> {
  /**
   * The database config list holding the resource's ID.
   */
  key: 'views' | 'designs' | 'entryTemplates';

  /**
   * Reads the resource from its file.
   */
  read: () => Promise<DatabaseFileReadResult<TResource>>;

  /**
   * Loads the read resource into the store.
   */
  load: (resource: TResource) => void;

  /**
   * Removes the resource from the store.
   */
  unload: () => void;

  /**
   * Returns the database's resources of this kind loaded in the store.
   */
  getLoaded: () => { id: string; created: Date }[];
}

/**
 * Reloads one of a database's resources (a view, design or entry
 * template) from its file into the store.
 * Removes the resource from the store if its file no longer exists.
 * Leaves the store's resource as it is if the file cannot be read.
 *
 * Normalizes the database's ID list for the resource kind in the store
 * against the database's loaded resources. Does not write the config file.
 *
 * @param databaseId - The ID of the database owning the resource.
 * @param workspaceId - The ID of the workspace the database belongs to.
 * @param options - The resource kind's config list and store operations.
 *
 * @throws {DatabaseNotFoundError} If the database is not in the workspace's store record.
 */
export async function reloadDatabaseResource<TResource>(
  databaseId: string,
  workspaceId: string,
  options: ReloadDatabaseResourceOptions<TResource>,
): Promise<void> {
  // Read the resource as it is on disk
  const read = await options.read();

  // Leave the store's resource as it is if the file cannot be read. An
  // unreadable file is not a deleted one.
  if (read.status === 'unreadable') {
    return;
  }

  if (read.status === 'missing') {
    // Remove the resource from the store if its file is gone
    options.unload();
  } else {
    // Otherwise, load the resource read
    options.load(read.value);
  }

  // Normalize the database's ID list against its loaded resources
  normalizeDatabaseConfigIds(
    databaseId,
    options.key,
    options.getLoaded(),
    workspaceId,
  );
}

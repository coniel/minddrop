import { Designs } from '@minddrop/designs-next';
import { Workspace } from '@minddrop/workspaces';
import { readDatabaseDesign } from '../readDatabaseDesign';
import { reloadDatabaseResource } from '../reloadDatabaseResource';
import { Database } from '../types';
import { resolveDatabaseDesignFilePath, resolveDatabasePath } from '../utils';

/**
 * Reloads a database-owned design from its file into the workspace's
 * designs store record. Removes the design from the store if its file
 * no longer exists. Leaves the store's design as it is if the file
 * cannot be read or is not a valid design.
 *
 * Normalizes the database's design ID list in the store against the
 * database's loaded designs. Does not write the config file.
 *
 * @param database - The database owning the design.
 * @param designId - The ID of the design to reload.
 * @param workspace - The workspace the database belongs to.
 *
 * @throws {DatabaseNotFoundError} If the database is not in the workspace's store record.
 */
export async function reloadDatabaseDesign(
  database: Database,
  designId: string,
  workspace: Workspace,
): Promise<void> {
  // Resolve the design's file path
  const path = resolveDatabaseDesignFilePath(
    resolveDatabasePath(database, workspace.path),
    designId,
  );

  // Reload the design
  await reloadDatabaseResource(database.id, workspace.id, {
    key: 'designs',
    read: () => readDatabaseDesign(path, database.id),
    load: (design) => Designs.load([design], workspace.id),
    unload: () => Designs.unload(designId, workspace.id),
    getLoaded: () => Designs.getByOwner(database.id, workspace.id),
  });
}

import { ContentViews } from '@minddrop/content-views';
import { Workspace } from '@minddrop/workspaces';
import { readDatabaseView } from '../readDatabaseView';
import { reloadDatabaseResource } from '../reloadDatabaseResource';
import { Database } from '../types';
import { resolveDatabasePath, resolveDatabaseViewFilePath } from '../utils';

/**
 * Reloads a database-owned view from its file into the workspace's
 * content views store record. Removes the view from the store if its
 * file no longer exists. Leaves the store's view as it is if the file
 * cannot be read.
 *
 * Normalizes the database's view ID list in the store against the
 * database's loaded views. Does not write the config file.
 *
 * @param database - The database owning the view.
 * @param viewId - The ID of the view to reload.
 * @param workspace - The workspace the database belongs to.
 *
 * @throws {DatabaseNotFoundError} If the database is not in the workspace's store record.
 */
export async function reloadDatabaseView(
  database: Database,
  viewId: string,
  workspace: Workspace,
): Promise<void> {
  // Resolve the view's file path
  const path = resolveDatabaseViewFilePath(
    resolveDatabasePath(database, workspace.path),
    viewId,
  );

  // Reload the view as a virtual view
  await reloadDatabaseResource(database.id, workspace.id, {
    key: 'views',
    read: () => readDatabaseView(path, database.id, workspace.id),
    load: (view) => ContentViews.loadVirtual([view], workspace.id),
    unload: () => ContentViews.unload(viewId, workspace.id),
    getLoaded: () => ContentViews.getByOwner(database.id, workspace.id),
  });
}

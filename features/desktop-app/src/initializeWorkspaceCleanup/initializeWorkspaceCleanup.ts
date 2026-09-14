import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Search } from '@minddrop/search';
import { Sql } from '@minddrop/sql';
import { Workspace, Workspaces } from '@minddrop/workspaces';

const LISTENER_ID = 'desktop-app:workspace-cleanup';

/**
 * Releases a workspace's per-device resources when it is removed:
 * unloads its search index, closes its SQL connection and removes
 * its data directory, in that order so that nothing writes into the
 * directory after it is gone.
 *
 * @returns A cleanup function that removes the listener.
 */
export function initializeWorkspaceCleanup(): VoidFunction {
  Events.addListener(Workspaces.events.Deleted, LISTENER_ID, cleanUpWorkspace);

  return () => {
    Events.removeListener(Workspaces.events.Deleted, LISTENER_ID);
  };
}

/**
 * Releases a removed workspace's resources.
 */
async function cleanUpWorkspace(workspace: Workspace): Promise<void> {
  // The index's pending persist reads the SQL connection, so the
  // index goes before the connection.
  await Search.unloadWorkspace(workspace.id);

  // The database file is deleted with the directory below, so the
  // connection goes before it.
  Sql.close(workspace.id);

  const dataDirPath = Workspaces.resolveDataDirPath(workspace.id);

  // A workspace which never loaded has no data directory
  if (await Fs.exists(dataDirPath)) {
    await Fs.removeDir(dataDirPath, { recursive: true });
  }
}

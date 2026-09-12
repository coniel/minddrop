import { FileSystemChangedEventData, Fs } from '@minddrop/file-system';
import { Workspace, Workspaces } from '@minddrop/workspaces';
import { getDatabaseBackendAdapter } from '../../DatabaseBackendAdapter';
import { DatabasesStore } from '../../DatabasesStore';
import {
  isDatabaseConfigFilePath,
  resolveDatabaseConfigFilePath,
  resolveDatabasePath,
} from '../../utils';

// How long to wait for changes to stop arriving before scanning.
// A scan covers the whole workspace, so a burst of changes should
// only cost one.
const DebounceMs = 500;

// The pending scans' timers, keyed by workspace ID, shared by every
// change in the workspace.
const scanTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Schedules a background sync of the workspace a database file
 * changed in outside of the app, so that entry identity and the
 * SQL index stay in one place. The resulting changeset is applied
 * by `handleBackgroundSyncResult`.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  const workspace = Workspaces.get(change.workspaceId);

  if (!(await isDatabaseChange(change, workspace))) {
    return;
  }

  // Restart the workspace's debounce, coalescing this change into
  // its pending scan.
  const scanTimer = scanTimers.get(workspace.id);

  if (scanTimer) {
    clearTimeout(scanTimer);
  }

  scanTimers.set(
    workspace.id,
    setTimeout(() => {
      scanTimers.delete(workspace.id);

      getDatabaseBackendAdapter().backgroundSync(workspace.id, workspace.path);
    }, DebounceMs),
  );
}

/**
 * Checks whether a change affects a database, either one already
 * loaded or one the app has not seen yet. Directories the user
 * keeps in the workspace for their own purposes are not databases
 * and are left alone.
 */
async function isDatabaseChange(
  change: FileSystemChangedEventData,
  workspace: Workspace,
): Promise<boolean> {
  const { path, kind } = change;
  // Anything inside a known database directory, including the
  // directory itself being deleted.
  const inKnownDatabase = DatabasesStore.in(workspace.id)
    .getAllArray()
    .some((database) => {
      const databasePath = resolveDatabasePath(database, workspace.path);

      return path === databasePath || path.startsWith(`${databasePath}/`);
    });

  if (inKnownDatabase) {
    return true;
  }

  // A config file outside every known database directory marks a
  // database the app has not seen yet.
  if (isDatabaseConfigFilePath(path)) {
    return true;
  }

  // A directory arriving whole, as when one is copied into the
  // workspace, may hold a config file whose own event the platform
  // watcher did not report separately. Only worth the check for
  // creations, modifications being far more frequent.
  if (kind === 'created') {
    return Fs.exists(resolveDatabaseConfigFilePath(path));
  }

  return false;
}

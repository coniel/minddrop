import { FileSystemChangedEventData, Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { getDatabaseBackendAdapter } from '../../DatabaseBackendAdapter';
import { getAllDatabases } from '../../getAllDatabases';
import { databaseConfigFilePath, isDatabaseConfigFilePath } from '../../utils';

// How long to wait for changes to stop arriving before scanning.
// A scan covers the whole workspace, so a burst of changes should
// only cost one.
const DebounceMs = 500;

// The pending scan's timer, shared by every change
let scanTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Schedules a background sync when a database file changes outside
 * of the app, so that entry identity and the SQL index stay in one
 * place. The resulting changeset is applied by
 * `handleBackgroundSyncResult`.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  if (!(await isDatabaseChange(change))) {
    return;
  }

  // Restart the debounce, coalescing this change into the pending
  // scan
  if (scanTimer) {
    clearTimeout(scanTimer);
  }

  scanTimer = setTimeout(() => {
    scanTimer = null;

    getDatabaseBackendAdapter().backgroundSync(Paths.workspace);
  }, DebounceMs);
}

/**
 * Checks whether a change affects a database, either one already
 * loaded or one the app has not seen yet. Directories the user
 * keeps in the workspace for their own purposes are not databases
 * and are left alone.
 */
async function isDatabaseChange(
  change: FileSystemChangedEventData,
): Promise<boolean> {
  const { path, kind } = change;

  // Anything inside a known database directory, including the
  // directory itself being deleted
  const inKnownDatabase = getAllDatabases().some(
    (database) =>
      path === database.path || path.startsWith(`${database.path}/`),
  );

  if (inKnownDatabase) {
    return true;
  }

  // A config file outside every known database directory marks a
  // database the app has not seen yet
  if (isDatabaseConfigFilePath(path)) {
    return true;
  }

  // A directory arriving whole, as when one is copied into the
  // workspace, may hold a config file whose own event the platform
  // watcher did not report separately. Only worth the check for
  // creations, modifications being far more frequent.
  if (kind === 'created') {
    return Fs.exists(databaseConfigFilePath(path));
  }

  return false;
}

import { FileSystemChangedEventData, Fs } from '@minddrop/file-system';
import { Workspace, Workspaces } from '@minddrop/workspaces';
import { getDatabaseBackendAdapter } from '../../DatabaseBackendAdapter';
import { getAllDatabases } from '../../getAllDatabases';
import { Database, EntryFileChange } from '../../types';
import {
  findEntryByMetadataKey,
  findPathDatabase,
  isDatabaseConfigFilePath,
  mergeEntryFileChanges,
  resolveDatabaseConfigFilePath,
  resolveDatabaseFilePathKind,
} from '../../utils';

// How long to wait for changes to stop arriving before syncing. A
// burst of changes then costs one sync.
const DebounceMs = 500;

// The most entry changes synced one by one. A larger burst is cheaper
// to diff as a whole workspace scan.
const MaxEntryFileChanges = 50;

interface PendingSync {
  /**
   * Whether a change needs a scan of the whole workspace, such as a
   * database config changing or a directory arriving.
   */
  scan: boolean;

  /**
   * The changed entry files, one per entry, synced one by one when
   * no scan is needed.
   */
  changes: EntryFileChange[];
}

// The changes awaiting the end of their workspace's debounce window,
// keyed by workspace ID.
const pendingSyncs = new Map<string, PendingSync>();

// The pending debounce timers, keyed by workspace ID
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

// The syncs in progress, keyed by workspace ID. A workspace's syncs
// run one at a time, so that two never interleave their SQL writes.
const runningSyncs = new Map<string, Promise<void>>();

// The changes which arrived while their workspace was syncing, keyed
// by workspace ID. They run as one sync once it finishes.
const queuedSyncs = new Map<string, PendingSync>();

/**
 * Schedules a sync of the database files changed outside of the app.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  // Get the change's workspace
  const workspace = Workspaces.get(change.workspaceId);
  // Work out what the change needs
  const route = await routeChange(change, workspace);

  // Skip changes which need nothing
  if (!route) {
    return;
  }

  // Add the change to the workspace's pending sync
  const pending = mergePendingSyncs(
    pendingSyncs.get(workspace.id),
    route === 'scan'
      ? { scan: true, changes: [] }
      : { scan: false, changes: [route] },
  );

  // Store the workspace's pending sync
  pendingSyncs.set(workspace.id, pending);

  // Get the workspace's debounce timer
  const timer = debounceTimers.get(workspace.id);

  // Clear the timer, restarting the debounce
  if (timer) {
    clearTimeout(timer);
  }

  // Start the sync once the debounce window closes
  debounceTimers.set(
    workspace.id,
    setTimeout(() => {
      // Clear the workspace's timer and pending sync
      debounceTimers.delete(workspace.id);
      pendingSyncs.delete(workspace.id);

      // Start the sync
      startSync(workspace, pending);
    }, DebounceMs),
  );
}

/**
 * Works out what a change needs: a sync of one entry's files, a scan
 * of the whole workspace, or nothing.
 *
 * @param change - The file system change.
 * @param workspace - The workspace the change is in.
 * @returns The entry file change to sync, 'scan', or null for nothing.
 */
async function routeChange(
  change: FileSystemChangedEventData,
  workspace: Workspace,
): Promise<EntryFileChange | 'scan' | null> {
  const { path, kind } = change;

  // Find the database the path is in
  const database = findPathDatabase(path, workspace.path, workspace.id);

  // Route a change inside a known database by what the path holds
  if (database) {
    return routeDatabaseChange(change, database, workspace);
  }

  // Scan for a config file outside every known database directory. It
  // marks a database the app has not seen yet.
  if (isDatabaseConfigFilePath(path)) {
    return 'scan';
  }

  // Scan for a directory arriving whole, as when one is copied into
  // the workspace. It may hold a config file whose own event the
  // platform watcher did not report separately. Only creations are
  // checked, as modifications are far more frequent.
  if (
    kind === 'created' &&
    (await Fs.exists(resolveDatabaseConfigFilePath(path)))
  ) {
    return 'scan';
  }

  // Leave other paths alone. Directories the user keeps in the
  // workspace for their own purposes are not databases.
  return null;
}

/**
 * Works out what a change inside a known database's directory needs.
 *
 * @param change - The file system change.
 * @param database - The database whose directory the change is in.
 * @param workspace - The workspace the database is in.
 * @returns The entry file change to sync, 'scan', or null for nothing.
 */
async function routeDatabaseChange(
  change: FileSystemChangedEventData,
  database: Database,
  workspace: Workspace,
): Promise<EntryFileChange | 'scan' | null> {
  // Classify the changed path
  const pathKind = resolveDatabaseFilePathKind(
    change.path,
    database,
    workspace.path,
  );

  switch (pathKind.kind) {
    // Sync an entry file alone
    case 'entry':
      return {
        databaseId: database.id,
        path: pathKind.entryPath,
        file: 'entry',
      };

    // Sync the entry owning a sidecar
    case 'metadata':
      return routeMetadataChange(pathKind.metadataKey, database, workspace);

    // Scan for a change to the database itself
    case 'database':
      return 'scan';

    // Leave views, designs and history to handlers of their own
    case 'app-state':
      return null;

    // Check whether another path carries entries with it
    case 'other':
      return routeOtherChange(change);
  }
}

/**
 * Routes a change to a metadata sidecar to a sync of its entry.
 *
 * @param metadataKey - The changed sidecar's metadata key.
 * @param database - The database the sidecar is in.
 * @param workspace - The workspace the database is in.
 * @returns The entry file change to sync, or null if no indexed entry owns the sidecar.
 */
function routeMetadataChange(
  metadataKey: string,
  database: Database,
  workspace: Workspace,
): EntryFileChange | null {
  // Find the indexed entry the sidecar belongs to
  const entry = findEntryByMetadataKey(database.id, metadataKey, workspace.id);

  // Skip a sidecar no indexed entry owns
  if (!entry) {
    return null;
  }

  // Sync the entry as a sidecar change
  return { databaseId: database.id, path: entry.path, file: 'metadata' };
}

/**
 * Routes a change to a path in a database directory which is neither
 * an entry file nor the database's own state. Files such as property
 * files have nothing indexed, but a directory being created or
 * deleted may contain entries.
 *
 * @param change - The file system change.
 * @returns 'scan' if the change may affect entries, otherwise null.
 */
async function routeOtherChange(
  change: FileSystemChangedEventData,
): Promise<'scan' | null> {
  // Scan when a directory is created. Check it exists first, as it may
  // already be gone again.
  if (change.kind === 'created') {
    // Check the path is an existing directory
    const isDirectory =
      (await Fs.exists(change.path)) && (await Fs.isDirectory(change.path));

    return isDirectory ? 'scan' : null;
  }

  // Scan when a path without an extension is deleted. A deleted path
  // cannot be checked for being a directory, so it is assumed to be
  // one.
  if (
    change.kind === 'deleted' &&
    !Fs.getExtension(Fs.fileNameFromPath(change.path))
  ) {
    return 'scan';
  }

  // Ignore any other change
  return null;
}

/**
 * Starts a workspace's sync, or queues it behind the one in progress.
 *
 * @param workspace - The workspace to sync.
 * @param pending - The changes to sync.
 */
function startSync(workspace: Workspace, pending: PendingSync): void {
  // Check if a sync is in progress. If so, merge into the queued sync.
  if (runningSyncs.has(workspace.id)) {
    queuedSyncs.set(
      workspace.id,
      mergePendingSyncs(queuedSyncs.get(workspace.id), pending),
    );

    return;
  }

  // Run the sync, then the changes which arrived in the meantime
  const sync = runSync(workspace, pending).finally(() => {
    // Clear the finished sync
    runningSyncs.delete(workspace.id);

    // Get the queued sync, if any
    const queued = queuedSyncs.get(workspace.id);

    // Start the queued sync
    if (queued) {
      queuedSyncs.delete(workspace.id);
      startSync(workspace, queued);
    }
  });

  // Track the running sync
  runningSyncs.set(workspace.id, sync);
}

/**
 * Runs a workspace's pending sync.
 *
 * @param workspace - The workspace to sync.
 * @param pending - The changes to sync.
 * @returns A promise resolving once the sync is done.
 */
function runSync(workspace: Workspace, pending: PendingSync): Promise<void> {
  // Get the database backend
  const backend = getDatabaseBackendAdapter();

  // Scan the whole workspace if a change needs it or the burst is too
  // large.
  if (pending.scan || pending.changes.length > MaxEntryFileChanges) {
    return backend.backgroundSync(workspace.id, workspace.path);
  }

  // Collect the IDs of the changed entries' databases
  const databaseIds = new Set(
    pending.changes.map((change) => change.databaseId),
  );
  // Get the databases the changed entries belong to
  const databases = getAllDatabases(workspace.id).filter((database) =>
    databaseIds.has(database.id),
  );

  // Sync the changed entry files
  return backend.syncEntryFiles(
    workspace.id,
    workspace.path,
    databases,
    pending.changes,
  );
}

/**
 * Merges a pending sync into another, keeping one change per entry.
 *
 * @param base - The pending sync to merge into, if any.
 * @param added - The pending sync to merge in.
 * @returns The merged pending sync.
 */
function mergePendingSyncs(
  base: PendingSync | undefined,
  added: PendingSync,
): PendingSync {
  return {
    // Scan if either sync needs it
    scan: (base?.scan ?? false) || added.scan,
    // Keep one change per entry
    changes: mergeEntryFileChanges([
      ...(base?.changes ?? []),
      ...added.changes,
    ]),
  };
}

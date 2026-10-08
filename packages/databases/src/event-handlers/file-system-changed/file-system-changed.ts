import { FileSystemChangedEventData, Fs } from '@minddrop/file-system';
import { Workspace, Workspaces } from '@minddrop/workspaces';
import { getDatabaseBackendAdapter } from '../../DatabaseBackendAdapter';
import { FileSystemChangeSyncDebounceMs } from '../../constants';
import { getAllDatabases } from '../../getAllDatabases';
import { readEntryFilePaths } from '../../readEntryFilePaths';
import { reloadDatabaseDesign } from '../../reloadDatabaseDesign';
import { reloadDatabaseEntryTemplate } from '../../reloadDatabaseEntryTemplate';
import { reloadDatabaseView } from '../../reloadDatabaseView';
import { Database, EntryFileChange } from '../../types';
import {
  findEntriesUnderPath,
  findEntryByMetadataKey,
  findPathDatabase,
  isDatabaseConfigFilePath,
  resolveDatabaseConfigFilePath,
  resolveDatabaseFilePathKind,
  resolveDatabasePath,
  resolveEntryChanges,
} from '../../utils';
import {
  DatabaseConfigChange,
  FileSystemChangedSyncs,
  PendingSync,
} from './FileSystemChangedSyncs';

// The most entry changes synced one by one. A larger burst is cheaper
// to diff as a whole workspace scan.
const MaxEntryFileChanges = 50;

/**
 * Schedules a sync of the database files changed outside of the app.
 * Reloads a changed view, design or entry template file directly, as
 * these need no sync.
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

  // Skip changes which need no sync
  if (!route) {
    return;
  }

  // Add the change to the workspace's pending sync
  const pending = mergePendingSyncs(
    FileSystemChangedSyncs.pending.get(workspace.id),
    convertRouteToPendingSync(route),
  );

  // Store the workspace's pending sync
  FileSystemChangedSyncs.pending.set(workspace.id, pending);

  // Get the workspace's debounce timer
  const timer = FileSystemChangedSyncs.debounceTimers.get(workspace.id);

  // Clear the timer to restart the debounce
  if (timer) {
    clearTimeout(timer);
  }

  // Start the sync once the debounce window closes
  FileSystemChangedSyncs.debounceTimers.set(
    workspace.id,
    setTimeout(() => {
      // Clear the workspace's timer and pending sync
      FileSystemChangedSyncs.debounceTimers.delete(workspace.id);
      FileSystemChangedSyncs.pending.delete(workspace.id);

      // Start the sync
      startSync(workspace, pending);
    }, FileSystemChangeSyncDebounceMs),
  );
}

/**
 * Works out what a change needs: a sync of some entries' files, a
 * sync of one database's config, a scan of the whole workspace, or
 * no sync. Reloads a changed view, design or entry template file
 * itself.
 *
 * @param change - The file system change.
 * @param workspace - The workspace the change is in.
 * @returns The entry file changes or config change to sync, 'scan', or
 *   null for no sync.
 */
async function routeChange(
  change: FileSystemChangedEventData,
  workspace: Workspace,
): Promise<EntryFileChange[] | DatabaseConfigChange | 'scan' | null> {
  // Get the changed path and the kind of change
  const { path, kind } = change;

  // Find the database the path is in
  const database = findPathDatabase(path, workspace.path, workspace.id);

  // Route a change inside a known database by the kind of path
  if (database) {
    return routeDatabaseChange(change, database, workspace);
  }

  // Check if the path is a config file outside every known database
  // directory. If so, scan. It marks a database the app has not seen
  // yet.
  if (isDatabaseConfigFilePath(path)) {
    return 'scan';
  }

  // Check if a created directory has a database config file. If so,
  // scan. A directory copied into the workspace arrives whole, and the
  // platform watcher may not report its config file separately. Only
  // creations are checked, as modifications are far more frequent.
  if (
    kind === 'created' &&
    (await Fs.exists(resolveDatabaseConfigFilePath(path)))
  ) {
    return 'scan';
  }

  // Ignore other paths. Directories the user keeps in the workspace
  // for their own purposes are not databases.
  return null;
}

/**
 * Works out what a change inside a known database's directory needs.
 * Reloads a changed view, design or entry template file itself.
 *
 * @param change - The file system change.
 * @param database - The database whose directory the change is in.
 * @param workspace - The workspace the database is in.
 * @returns The entry file changes or config change to sync, 'scan', or
 *   null for no sync.
 */
async function routeDatabaseChange(
  change: FileSystemChangedEventData,
  database: Database,
  workspace: Workspace,
): Promise<EntryFileChange[] | DatabaseConfigChange | 'scan' | null> {
  // Classify the changed path
  const pathKind = resolveDatabaseFilePathKind(
    change.path,
    database,
    workspace.path,
  );

  switch (pathKind.kind) {
    // Sync an entry file alone
    case 'entry':
      return [
        {
          databaseId: database.id,
          path: pathKind.entryPath,
          file: 'entry',
        },
      ];

    // Sync the entry owning a sidecar
    case 'metadata':
      return routeMetadataChange(pathKind.metadataKey, database, workspace);

    // Scan for a change to the database itself
    case 'database':
      return 'scan';

    // Sync the database's config alone
    case 'config':
      return { databaseId: database.id, file: 'config' };

    // Reload a view. Views need no sync.
    case 'view':
      await reloadDatabaseView(database, pathKind.viewId, workspace);

      return null;

    // Reload a design. Designs need no sync.
    case 'design':
      await reloadDatabaseDesign(database, pathKind.designId, workspace);

      return null;

    // Reload an entry template. Entry templates need no sync.
    case 'entry-template':
      await reloadDatabaseEntryTemplate(
        database,
        pathKind.templateId,
        workspace,
      );

      return null;

    // Ignore history and other app state
    case 'app-state':
      return null;

    // Sync the entries another path holds, if any
    case 'other':
      return routeOtherChange(change, database, workspace);
  }
}

/**
 * Routes a change to a metadata sidecar to a sync of its entry.
 *
 * @param metadataKey - The changed sidecar's metadata key.
 * @param database - The database the sidecar is in.
 * @param workspace - The workspace the database is in.
 * @returns The entry file change to sync, or null if no indexed entry
 *   owns the sidecar.
 */
function routeMetadataChange(
  metadataKey: string,
  database: Database,
  workspace: Workspace,
): EntryFileChange[] | null {
  // Find the indexed entry the sidecar belongs to
  const entry = findEntryByMetadataKey(database.id, metadataKey, workspace.id);

  // Skip a sidecar no indexed entry owns
  if (!entry) {
    return null;
  }

  // Sync the entry as a sidecar change
  return [{ databaseId: database.id, path: entry.path, file: 'metadata' }];
}

/**
 * Routes a change to any other path in a database directory to a sync
 * of the entries it holds.
 *
 * @param change - The file system change.
 * @param database - The database the path is in.
 * @param workspace - The workspace the database is in.
 * @returns The entry file changes to sync, or null if the change holds
 *   no entries.
 */
async function routeOtherChange(
  change: FileSystemChangedEventData,
  database: Database,
  workspace: Workspace,
): Promise<EntryFileChange[] | null> {
  // Get the entry file paths the change affects
  const entryPaths = await resolveOtherChangeEntryPaths(
    change,
    database,
    workspace,
  );

  // Skip the change if it affects no entries
  if (!entryPaths.length) {
    return null;
  }

  // Sync each affected entry
  return entryPaths.map((path) => ({
    databaseId: database.id,
    path,
    file: 'entry',
  }));
}

/**
 * Resolves the paths of the entry files a change to any other path in
 * a database directory affects: the entry files in a created
 * directory, or the indexed entries under a deleted path.
 *
 * @param change - The file system change.
 * @param database - The database the path is in.
 * @param workspace - The workspace the database is in.
 * @returns The entry file paths, relative to the database directory.
 */
async function resolveOtherChangeEntryPaths(
  change: FileSystemChangedEventData,
  database: Database,
  workspace: Workspace,
): Promise<string[]> {
  // List the entry files in a created directory, after checking it
  // still exists. A copied-in entry directory arrives whole, and the
  // platform watcher may not report its entry file separately.
  if (change.kind === 'created') {
    // Check the path is an existing directory
    const isDirectory =
      (await Fs.exists(change.path)) && (await Fs.isDirectory(change.path));

    // Skip a path which is gone or is not a directory
    if (!isDirectory) {
      return [];
    }

    // Read the directory's entry file paths
    return readEntryFilePaths(database, {
      workspacePath: workspace.path,
      dirPath: change.path,
    });
  }

  // Find the indexed entries under a deleted path. A deleted path
  // cannot be checked for being a directory, so any path is searched.
  if (change.kind === 'deleted') {
    return findEntriesUnderPath(
      database.id,
      Fs.relativePath(
        resolveDatabasePath(database, workspace.path),
        change.path,
      ),
      workspace.id,
    ).map((entry) => entry.path);
  }

  // Ignore any other change
  return [];
}

/**
 * Starts a workspace's sync, or queues it behind the one in progress.
 *
 * @param workspace - The workspace to sync.
 * @param pending - The changes to sync.
 */
function startSync(workspace: Workspace, pending: PendingSync): void {
  // Check if a sync is in progress. If so, merge into the queued sync.
  if (FileSystemChangedSyncs.running.has(workspace.id)) {
    FileSystemChangedSyncs.queued.set(
      workspace.id,
      mergePendingSyncs(
        FileSystemChangedSyncs.queued.get(workspace.id),
        pending,
      ),
    );

    return;
  }

  // Run the sync, then the changes which arrived in the meantime
  const sync = runSync(workspace, pending).finally(() => {
    // Clear the finished sync
    FileSystemChangedSyncs.running.delete(workspace.id);

    // Get the queued sync, if any
    const queued = FileSystemChangedSyncs.queued.get(workspace.id);

    // Start the queued sync
    if (queued) {
      FileSystemChangedSyncs.queued.delete(workspace.id);
      startSync(workspace, queued);
    }
  });

  // Track the running sync
  FileSystemChangedSyncs.running.set(workspace.id, sync);
}

/**
 * Runs a workspace's pending sync.
 *
 * @param workspace - The workspace to sync.
 * @param pending - The changes to sync.
 * @returns A promise resolving once the sync is done.
 */
async function runSync(
  workspace: Workspace,
  pending: PendingSync,
): Promise<void> {
  // Get the database backend
  const backend = getDatabaseBackendAdapter();

  // Check if a change needs a scan or the burst is too large. If so,
  // scan the whole workspace.
  if (pending.scan || pending.changes.length > MaxEntryFileChanges) {
    return backend.backgroundSync(workspace.id, workspace.path);
  }

  // Get the workspace's databases
  const databases = getAllDatabases(workspace.id);

  // Sync the changed entry files, if any
  if (pending.changes.length) {
    // Collect the IDs of the changed entries' databases
    const databaseIds = new Set(
      pending.changes.map((change) => change.databaseId),
    );

    // Sync the changed entry files against their databases
    await backend.syncEntryFiles(
      workspace.id,
      workspace.path,
      databases.filter((database) => databaseIds.has(database.id)),
      pending.changes,
    );
  }

  // Sync the changed configs, if any. This runs after the entry sync,
  // so a schema change re-indexes entries the entry sync read against
  // the old schema.
  if (pending.databaseIds.length) {
    await backend.syncDatabaseConfigs(
      workspace.id,
      workspace.path,
      databases.filter((database) => pending.databaseIds.includes(database.id)),
      pending.databaseIds,
    );
  }
}

/**
 * Merges a pending sync into another. Keeps one change per entry.
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
    changes: resolveEntryChanges([...(base?.changes ?? []), ...added.changes]),
    // Keep each changed config's database once
    databaseIds: [
      ...new Set([...(base?.databaseIds ?? []), ...added.databaseIds]),
    ],
  };
}

/**
 * Converts a routed change into a pending sync of that change alone.
 *
 * @param route - The routed change.
 * @returns The pending sync.
 */
function convertRouteToPendingSync(
  route: EntryFileChange[] | DatabaseConfigChange | 'scan',
): PendingSync {
  // Scan the whole workspace
  if (route === 'scan') {
    return { scan: true, changes: [], databaseIds: [] };
  }

  // Sync the entries' files
  if (Array.isArray(route)) {
    return { scan: false, changes: route, databaseIds: [] };
  }

  // Sync the database's config
  return { scan: false, changes: [], databaseIds: [route.databaseId] };
}

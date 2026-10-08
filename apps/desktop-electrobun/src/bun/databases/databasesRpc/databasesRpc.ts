import type {
  BackgroundSyncChangeset,
  Database,
  EntryFileChange,
  InitializeBackendResult,
} from '@minddrop/databases';
import { Databases } from '@minddrop/databases';

type SyncChangesetSender = (changeset: BackgroundSyncChangeset) => void;

let syncChangesetSender: SyncChangesetSender | null = null;

/**
 * Registers a callback for sending background sync
 * changesets to the webview.
 */
export function setSyncChangesetSender(sender: SyncChangesetSender): void {
  syncChangesetSender = sender;
}

/**
 * RPC handler for backend-side database initialization.
 * Opens SQL, reads database configs, and returns all
 * data needed to hydrate frontend stores.
 */
export async function handleDatabasesInitialize(params: {
  workspaceId: string;
  workspacePath: string;
}): Promise<InitializeBackendResult> {
  return Databases.initializeBackend(params.workspaceId, params.workspacePath);
}

/**
 * RPC handler for background sync. Returns void immediately
 * and runs the sync in the background. Sends a changeset
 * message to the webview when done.
 */
export async function handleDatabasesBackgroundSync(params: {
  workspaceId: string;
  workspacePath: string;
}): Promise<void> {
  // Run the background sync
  const changeset = await Databases.backgroundSync(
    params.workspaceId,
    params.workspacePath,
  );

  // Send the changeset to the webview
  sendSyncChangeset(changeset);
}

/**
 * RPC handler for re-indexing the entries whose files changed
 * outside of the app. Sends a changeset message to the webview when
 * done.
 *
 * @param params - The workspace, and the databases and entry files
 *   which changed in it.
 */
export async function handleDatabasesSyncEntryFiles(params: {
  workspaceId: string;
  workspacePath: string;
  databases: Database[];
  changes: EntryFileChange[];
}): Promise<void> {
  // Re-index the changed entry files
  const changeset = await Databases.syncEntryFiles(
    params.workspaceId,
    params.workspacePath,
    params.databases,
    params.changes,
  );

  // Send the changeset to the webview
  sendSyncChangeset(changeset);
}

/**
 * RPC handler for re-indexing the databases whose configs changed
 * outside of the app. Sends a changeset message to the webview when
 * done.
 *
 * @param params - The workspace, its databases, and the IDs of the
 *   databases whose configs changed.
 */
export async function handleDatabasesSyncDatabaseConfigs(params: {
  workspaceId: string;
  workspacePath: string;
  databases: Database[];
  databaseIds: string[];
}): Promise<void> {
  // Re-index the changed database configs
  const changeset = await Databases.syncDatabaseConfigs(
    params.workspaceId,
    params.workspacePath,
    params.databases,
    params.databaseIds,
  );

  // Send the changeset to the webview
  sendSyncChangeset(changeset);
}

/**
 * Sends a sync changeset to the webview, if it has any changes.
 *
 * @param changeset - The sync changeset to send.
 */
function sendSyncChangeset(changeset: BackgroundSyncChangeset): void {
  // Check the changeset has changes and a sender is registered
  if (changeset.hasChanges && syncChangesetSender) {
    syncChangesetSender(changeset);
  }
}

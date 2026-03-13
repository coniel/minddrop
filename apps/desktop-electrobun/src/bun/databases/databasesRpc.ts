import type {
  BackgroundSyncChangeset,
  Database,
  InitializeBackendResult,
  SqlInitializeResult,
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
 * RPC handler for initializing the SQL database with
 * all database and entry data for a workspace.
 */
export async function handleDatabasesSqlInitialize(params: {
  workspaceId: string;
  databases: Database[];
}): Promise<SqlInitializeResult> {
  return Databases.sql.initialize(params.workspaceId, params.databases);
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
  workspacePath: string;
}): Promise<void> {
  const changeset = await Databases.backgroundSync(params.workspacePath);

  // Only send if there were changes
  if (changeset.hasChanges && syncChangesetSender) {
    syncChangesetSender(changeset);
  }
}

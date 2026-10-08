import type { InitializeBackendResult } from './sql';
import type { Database, EntryFileChange } from './types';

export interface DatabaseBackendAdapter {
  /**
   * Backend-side initialization orchestrator. Opens SQL,
   * reads database configs, and returns all data needed
   * to hydrate frontend stores in a single call.
   */
  initializeBackend(
    workspaceId: string,
    workspacePath: string,
  ): Promise<InitializeBackendResult>;

  /**
   * Triggers a background filesystem scan to detect
   * changes that occurred while the app was not running.
   * Results are delivered via a message callback.
   */
  backgroundSync(workspaceId: string, workspacePath: string): Promise<void>;

  /**
   * Re-indexes the entries whose files changed outside of the app,
   * reading only those entries' files. Results are delivered via
   * the same message callback as a background sync.
   */
  syncEntryFiles(
    workspaceId: string,
    workspacePath: string,
    databases: Database[],
    changes: EntryFileChange[],
  ): Promise<void>;

  /**
   * Re-indexes the databases whose configs changed outside of the app.
   * Reads only those databases' configs, and their entries when their
   * property schema changed. Results are delivered via the same message
   * callback as a background sync.
   *
   * @param workspaceId - The ID of the workspace the databases belong to.
   * @param workspacePath - The absolute path to the workspace root.
   * @param databases - The databases as currently loaded.
   * @param databaseIds - The IDs of the databases whose configs changed.
   */
  syncDatabaseConfigs(
    workspaceId: string,
    workspacePath: string,
    databases: Database[],
    databaseIds: string[],
  ): Promise<void>;

  /**
   * Fills a workspace's entry content index if it is pending.
   *
   * @param workspaceId - The ID of the workspace whose index to fill.
   */
  fillEntryContentIndex(workspaceId: string): Promise<void>;
}

let adapter: DatabaseBackendAdapter | null = null;

/**
 * Registers the platform-specific backend adapter for
 * database initialization and sync operations.
 */
export function registerDatabaseBackendAdapter(
  backendAdapter: DatabaseBackendAdapter,
): void {
  adapter = backendAdapter;
}

/**
 * Returns the registered backend adapter.
 * Throws if no adapter has been registered.
 */
export function getDatabaseBackendAdapter(): DatabaseBackendAdapter {
  if (!adapter) {
    throw new Error('Database backend adapter not registered');
  }

  return adapter;
}

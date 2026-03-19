import type { InitializeBackendResult } from './sql';

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
  backgroundSync(workspacePath: string): Promise<void>;
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

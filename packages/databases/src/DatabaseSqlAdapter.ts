import type { InitializeBackendResult, SqlInitializeResult } from './sql';
import type { Database } from './types';

export interface DatabaseSqlAdapter {
  /**
   * Initializes the SQL database for a workspace.
   * Populates database and entry records, returns the
   * schema change flag and any incrementally changed or
   * deleted entries.
   */
  initialize(
    workspaceId: string,
    databases: Database[],
  ): Promise<SqlInitializeResult>;

  /**
   * Backend-side initialization orchestrator. Opens SQL,
   * reads database configs, and returns all data needed
   * to hydrate frontend stores in a single call.
   */
  initializeBackend(
    workspaceId: string,
    workspacePath: string,
  ): Promise<InitializeBackendResult>;
}

let adapter: DatabaseSqlAdapter | null = null;

/**
 * Registers an adapter that handles SQL initialization
 * via the platform's back-end (e.g. Bun RPC).
 */
export function registerDatabaseSqlAdapter(
  sqlAdapter: DatabaseSqlAdapter,
): void {
  adapter = sqlAdapter;
}

/**
 * Returns the registered SQL adapter.
 * Throws if no adapter has been registered.
 */
export function getDatabaseSqlAdapter(): DatabaseSqlAdapter {
  if (!adapter) {
    throw new Error('Database SQL adapter not registered');
  }

  return adapter;
}

import { getDatabaseSqlAdapter } from '../DatabaseSqlAdapter';
import type { InitializeBackendResult } from './initializeDatabasesBackend';

/**
 * Initializes the backend SQL database and returns all
 * databases and entries needed to hydrate frontend stores.
 */
export function sqlInitializeBackend(
  workspaceId: string,
  workspacePath: string,
): Promise<InitializeBackendResult> {
  return getDatabaseSqlAdapter().initializeBackend(workspaceId, workspacePath);
}

import type {
  Database,
  InitializeBackendResult,
  SqlInitializeResult,
} from '@minddrop/databases';
import { Databases } from '@minddrop/databases';

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

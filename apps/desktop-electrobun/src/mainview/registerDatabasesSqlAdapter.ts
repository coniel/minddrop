import { Databases } from '@minddrop/databases';

/**
 * Registers a databases SQL adapter that forwards the SQL
 * initialization request to the Bun process via RPC.
 */
export function registerDatabasesSqlAdapterRpc(rpc: any): void {
  Databases.registerSqlAdapter({
    initialize: (workspaceId, databases) =>
      rpc.request.databasesSqlInitialize({ workspaceId, databases }),
    initializeBackend: (workspaceId, workspacePath) =>
      rpc.request.databasesInitialize({ workspaceId, workspacePath }),
    backgroundSync: (workspacePath) =>
      rpc.request.databasesBackgroundSync({ workspacePath }),
  });
}

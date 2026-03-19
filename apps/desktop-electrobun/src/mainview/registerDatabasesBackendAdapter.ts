import { Databases } from '@minddrop/databases';

/**
 * Registers a databases backend adapter that forwards
 * initialization and sync operations to the Bun process
 * via RPC.
 */
export function registerDatabasesBackendAdapterRpc(rpc: any): void {
  Databases.registerBackendAdapter({
    initializeBackend: (workspaceId, workspacePath) =>
      rpc.request.databasesInitialize({ workspaceId, workspacePath }),
    backgroundSync: (workspacePath) =>
      rpc.request.databasesBackgroundSync({ workspacePath }),
  });
}

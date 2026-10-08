import { Databases } from '@minddrop/databases';
import type { WebviewRpcClient } from '../types';

/**
 * Registers a databases backend adapter which forwards its
 * operations to the Bun process via RPC.
 */
export function registerDatabasesBackendAdapterRpc(
  rpc: WebviewRpcClient,
): void {
  Databases.registerBackendAdapter({
    initializeBackend: (workspaceId, workspacePath) =>
      rpc.request.databasesInitialize({ workspaceId, workspacePath }),
    backgroundSync: (workspaceId, workspacePath) =>
      rpc.request.databasesBackgroundSync({ workspaceId, workspacePath }),
    syncEntryFiles: (workspaceId, workspacePath, databases, changes) =>
      rpc.request.databasesSyncEntryFiles({
        workspaceId,
        workspacePath,
        databases,
        changes,
      }),
    syncDatabaseConfigs: (workspaceId, workspacePath, databases, databaseIds) =>
      rpc.request.databasesSyncDatabaseConfigs({
        workspaceId,
        workspacePath,
        databases,
        databaseIds,
      }),
    fillEntryContentIndex: (workspaceId) =>
      rpc.request.databasesFillEntryContentIndex({ workspaceId }),
  });
}

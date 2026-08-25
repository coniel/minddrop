import { Databases } from '@minddrop/databases';
import type { WebviewRpcClient } from '../types';

/**
 * Registers a databases backend adapter that forwards
 * initialization and sync operations to the Bun process
 * via RPC.
 */
export function registerDatabasesBackendAdapterRpc(
  rpc: WebviewRpcClient,
): void {
  Databases.registerBackendAdapter({
    initializeBackend: (workspaceId, workspacePath) =>
      rpc.request.databasesInitialize({ workspaceId, workspacePath }),
    backgroundSync: (workspacePath) =>
      rpc.request.databasesBackgroundSync({ workspacePath }),
  });
}

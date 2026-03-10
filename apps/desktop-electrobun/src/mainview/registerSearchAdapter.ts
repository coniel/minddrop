import { registerSearchAdapter } from '@minddrop/search';

/**
 * Registers a search adapter that forwards search requests
 * to the Bun process via RPC.
 */
export function registerSearchAdapterRpc(rpc: any): void {
  registerSearchAdapter({
    searchFullText: (workspaceId, query, limit, databaseId) =>
      rpc.request.searchFullText({ workspaceId, query, limit, databaseId }),
  });
}

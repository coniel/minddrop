import { Search } from '@minddrop/search';

/**
 * Registers a search adapter that forwards search requests
 * to the Bun process via RPC.
 */
export function registerSearchAdapterRpc(rpc: any): void {
  Search.registerAdapter({
    searchFullText: (workspaceId, query, limit, databaseId) =>
      rpc.request.searchFullText({ workspaceId, query, limit, databaseId }),

    searchInitialize: (params) => rpc.request.searchInitialize(params),

    searchSync: (params) => rpc.request.searchSync(params),

    searchDatabaseSync: (params) => rpc.request.searchDatabaseSync(params),

    searchReindexDatabase: (params) =>
      rpc.request.searchReindexDatabase(params),

    searchRenameProperty: (params) => rpc.request.searchRenameProperty(params),
  });
}

import { BrowserView } from 'electrobun/bun';
import { WebviewRPC } from '../types/WebviewRPC.types';
import { backEndUtilsRpcHandlers } from './backEndUtilsRpc';
import {
  handleDatabasesBackgroundSync,
  handleDatabasesInitialize,
  setSyncChangesetSender,
} from './databases';
import { fileSystemRpcHandlers, setWatchEventSender } from './fileSystemRpc';
import { screenshotRpcHandlers } from './screenshotRpc';
import {
  handleSearchDatabaseSync,
  handleSearchFullText,
  handleSearchInitialize,
  handleSearchReindexDatabase,
  handleSearchSync,
} from './search';
import { httpServer } from './server';
import {
  handleSqlAll,
  handleSqlClose,
  handleSqlExec,
  handleSqlGet,
  handleSqlOpen,
  handleSqlRun,
  handleSqlTransaction,
} from './sql';
import { windowRpcHandlers } from './windowRpc';

export type RpcHandler = typeof fileSystemRpcHandlers;

/**
 * Creates an RPC object for the bun handlers with the shared type, and
 * routes bun initiated messages to it. Each window gets its own, as an
 * RPC object is bound to a single webview's transport.
 */
export function createWebviewRPC() {
  const rpc = BrowserView.defineRPC<WebviewRPC>({
    maxRequestTime: 5000,
    handlers: {
      requests: {
        ...fileSystemRpcHandlers,
        ...backEndUtilsRpcHandlers,
        // HTTP server port
        getHttpServerPort: () => httpServer.port,
        // Window RPC handlers
        ...windowRpcHandlers,
        // Screenshot RPC handlers
        ...screenshotRpcHandlers,
        // SQL RPC handlers
        sqlOpen: handleSqlOpen,
        sqlExec: handleSqlExec,
        sqlRun: handleSqlRun,
        sqlGet: handleSqlGet,
        sqlAll: handleSqlAll,
        sqlTransaction: handleSqlTransaction,
        sqlClose: handleSqlClose,
        // Databases RPC handlers
        databasesInitialize: handleDatabasesInitialize,
        databasesBackgroundSync: handleDatabasesBackgroundSync,
        // Search RPC handlers
        searchInitialize: handleSearchInitialize,
        searchFullText: handleSearchFullText,
        searchSync: handleSearchSync,
        searchDatabaseSync: handleSearchDatabaseSync,
        searchReindexDatabase: handleSearchReindexDatabase,
      },
      // When the browser sends a message we can handle it
      // in the main bun process
      messages: {
        '*': (messageName: string, payload: unknown) => {
          console.log('global message handler', messageName, payload);
        },
      },
    },
  });

  setWatchEventSender((event) => {
    rpc.send.fsWatchEvent(event);
  });

  setSyncChangesetSender((changeset) => {
    rpc.send.databasesSyncChangeset(changeset);
  });

  return rpc;
}

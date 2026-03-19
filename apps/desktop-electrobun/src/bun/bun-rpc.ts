import { BrowserView } from 'electrobun/bun';
import { WebviewRPC } from '../types/WebviewRPC.types';
import { backEndUtilsRpcHandlers } from './backEndUtilsRpc';
import {
  handleDatabasesBackgroundSync,
  handleDatabasesInitialize,
  setSyncChangesetSender,
} from './databases';
import { fileSystemRpcHandlers, setWatchEventSender } from './fileSystemRpc';
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

export type RpcHandler = typeof fileSystemRpcHandlers;

// Create an RPC object for the bun handlers with the shared type
export const myWebviewRPC = BrowserView.defineRPC<WebviewRPC>({
  maxRequestTime: 5000,
  handlers: {
    requests: {
      ...fileSystemRpcHandlers,
      ...backEndUtilsRpcHandlers,
      // HTTP server port
      getHttpServerPort: () => httpServer.port,
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
      '*': (messageName, payload) => {
        console.log('global message handler', messageName, payload);
      },
    },
  },
});

setWatchEventSender((event) => {
  myWebviewRPC.send.fsWatchEvent(event);
});

setSyncChangesetSender((changeset) => {
  myWebviewRPC.send.databasesSyncChangeset(changeset);
});

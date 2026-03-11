import { BrowserView } from 'electrobun/bun';
import { WebviewRPC } from '../types/WebviewRPC.types';
import { backEndUtilsRpcHandlers } from './backEndUtilsRpc';
import { fileSystemRpcHandlers, setWatchEventSender } from './fileSystemRpc';
import {
  handleSearchDatabaseSync,
  handleSearchFullText,
  handleSearchInitialize,
  handleSearchReindexDatabase,
  handleSearchRenameProperty,
  handleSearchStructured,
  handleSearchSync,
} from './search';

export type RpcHandler = typeof fileSystemRpcHandlers;

// Create an RPC object for the bun handlers with the shared type
export const myWebviewRPC = BrowserView.defineRPC<WebviewRPC>({
  maxRequestTime: 5000,
  handlers: {
    requests: {
      ...fileSystemRpcHandlers,
      ...backEndUtilsRpcHandlers,
      searchInitialize: handleSearchInitialize,
      searchFullText: handleSearchFullText,
      searchStructured: handleSearchStructured,
      searchSync: handleSearchSync,
      searchDatabaseSync: handleSearchDatabaseSync,
      searchReindexDatabase: handleSearchReindexDatabase,
      searchRenameProperty: handleSearchRenameProperty,
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

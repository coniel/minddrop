import { BrowserView } from 'electrobun/bun';
import { WebviewRPC } from '../types/WebviewRPC.types';
import { backEndUtilsRpcHandlers } from './backEndUtilsRpc';
import { fileSystemRpcHandlers } from './fileSystemRpc';

export type RpcHandler = typeof fileSystemRpcHandlers;

// Create an RPC object for the bun handlers with the shared type
export const myWebviewRPC = BrowserView.defineRPC<WebviewRPC>({
  maxRequestTime: 5000,
  handlers: {
    requests: {
      ...fileSystemRpcHandlers,
      ...backEndUtilsRpcHandlers,
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

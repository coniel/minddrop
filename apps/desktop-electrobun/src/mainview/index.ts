import Electrobun, { Electroview } from 'electrobun/view';
import { WebviewRPC } from '../types';
import { registerBackEndUtilsAdapter } from './registerBackEndUtilsAdapter';
import {
  registerFileSystemAdapter,
  handleWatchEvent,
} from './registerFileSystemAdapter';

export const rpc = Electroview.defineRPC<WebviewRPC>({
  // Disable RPC timeout to allow for long-running operations
  // like native file dialogs that block until user interaction.
  maxRequestTime: Infinity,
  handlers: {
    messages: {
      logToWebview: ({ message }) => {
        // this will appear in the inspect element devtools console
        console.log('bun', message);
      },
      fsWatchEvent: (event) => {
        handleWatchEvent(event);
      },
    },
  },
});

// Initialize Electrobun with RPC
const electrobun = new Electrobun.Electroview({ rpc });

registerFileSystemAdapter(electrobun.rpc);
registerBackEndUtilsAdapter(electrobun.rpc);

import Electrobun, { Electroview } from 'electrobun/view';
import { Databases } from '@minddrop/databases';
import { Events, ToggleWindowFillEvent } from '@minddrop/events';
import { Paths } from '@minddrop/utils';
import { WebviewRPC } from '../types';
import { registerBackEndUtilsAdapter } from './registerBackEndUtilsAdapter';
import { registerDatabasesBackendAdapterRpc } from './registerDatabasesBackendAdapter';
import {
  handleWatchEvent,
  registerFileSystemAdapter,
} from './registerFileSystemAdapter';
import { registerScreenshotAdapterRpc } from './registerScreenshotAdapter';
import { registerSearchAdapterRpc } from './registerSearchAdapter';
import { registerSqlAdapterRpc } from './registerSqlAdapter';

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
      databasesSyncChangeset: (changeset) => {
        Databases.handleBackgroundSyncResult(changeset);
      },
    },
  },
});

// Initialize Electrobun with RPC
const electrobun = new Electrobun.Electroview({ rpc });

registerFileSystemAdapter(electrobun.rpc);
registerBackEndUtilsAdapter(electrobun.rpc);
registerSqlAdapterRpc(electrobun.rpc);
registerDatabasesBackendAdapterRpc(electrobun.rpc);
registerSearchAdapterRpc(electrobun.rpc);

// Toggle the window fill when the top bar is double-clicked
Events.addListener(ToggleWindowFillEvent, 'desktop-electrobun', () => {
  electrobun.rpc?.request.windowToggleFill({});
});

// Fetch the HTTP server port and store it for use by
// file system operations (image loading, binary uploads)
const httpServerPort = await electrobun.rpc.request.getHttpServerPort({});
Paths.httpServerHost = `http://localhost:${httpServerPort}`;

// Enable screen capture on the dev channel only, leaving the
// screenshot picker inert elsewhere
if (electrobun.rpc) {
  const appChannel = await electrobun.rpc.request.getAppChannel({});

  if (appChannel === 'dev') {
    registerScreenshotAdapterRpc(electrobun.rpc);
  }
}

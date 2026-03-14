import Electrobun, { Electroview } from 'electrobun/view';
import { Databases } from '@minddrop/databases';
import { Paths } from '@minddrop/utils';
import { WebviewRPC } from '../types';
import { registerBackEndUtilsAdapter } from './registerBackEndUtilsAdapter';
import { registerDatabasesSqlAdapterRpc } from './registerDatabasesSqlAdapter';
import {
  handleWatchEvent,
  registerFileSystemAdapter,
} from './registerFileSystemAdapter';
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
registerDatabasesSqlAdapterRpc(electrobun.rpc);
registerSearchAdapterRpc(electrobun.rpc);

// Fetch the HTTP server port and store it for use by
// file system operations (image loading, binary uploads)
const httpServerPort = await electrobun.rpc.request.getHttpServerPort({});
Paths.httpServerHost = `http://localhost:${httpServerPort}`;

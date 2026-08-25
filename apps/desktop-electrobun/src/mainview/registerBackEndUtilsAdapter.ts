import { registerBackendUtilsAdapter as register } from '@minddrop/utils';
import type { WebviewRpcClient } from '../types';

export const registerBackEndUtilsAdapter = (rpc: WebviewRpcClient) =>
  register({
    openFile: (path: string) => rpc.request.openFile({ path }),

    openUrl: (url: string) => rpc.request.openUrl({ url }),

    showItemInFolder: (path: string) => rpc.request.showItemInFolder({ path }),

    getWebpageHtml: (url: string) => {
      return rpc.request.getWebpageHtml({ url });
    },
  });

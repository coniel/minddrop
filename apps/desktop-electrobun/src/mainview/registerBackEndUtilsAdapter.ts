import { registerBackendUtilsAdapter as register } from '@minddrop/utils';

export const registerBackEndUtilsAdapter = (rpc: any) =>
  register({
    openFile: (path: string) => rpc.request.openFile({ path }),

    openUrl: (url: string) => rpc.request.openUrl({ url }),

    showItemInFolder: (path: string) => rpc.request.showItemInFolder({ path }),

    getWebpageHtml: (url: string) => {
      return rpc.request.getWebpageHtml({ url });
    },
  });

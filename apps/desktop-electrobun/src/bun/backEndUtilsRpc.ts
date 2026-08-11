import { Updater, Utils } from 'electrobun/bun';

export const backEndUtilsRpcHandlers = {
  getAppChannel: async () => Updater.localInfo.channel(),

  openFile: async ({ path }: { path: string }) => {
    Utils.openPath(path);
  },

  openUrl: async ({ url }: { url: string }) => {
    Utils.openExternal(url);
  },

  showItemInFolder: async ({ path }: { path: string }) => {
    Utils.showItemInFolder(path);
  },

  getWebpageHtml: async ({ url }: { url: string }) => {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'MindDrop/1.0' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch webpage: ${response.statusText}`);
    }

    return response.text();
  },
};

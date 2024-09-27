import { invoke } from '@tauri-apps/api/core';
import { registerBackendUtilsAdapter } from '@minddrop/utils';

registerBackendUtilsAdapter({
  getWebpageHtml: async (url: string) => {
    const result = await invoke<string>('webpage_html', {
      url,
    }).catch((reason) => {
      throw new Error(reason);
    });

    return result;
  },
});

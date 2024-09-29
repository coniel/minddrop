import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-shell';
import { registerBackendUtilsAdapter } from '@minddrop/utils';

registerBackendUtilsAdapter({
  open,
  getWebpageHtml: async (url: string) => {
    const result = await invoke<string>('webpage_html', {
      url,
    }).catch((reason) => {
      throw new Error(reason);
    });

    return result;
  },
});

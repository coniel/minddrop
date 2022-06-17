import { initializeCore } from '@minddrop/core';
import {
  Drops,
  onRun as onRunDrops,
  onDisable as onDisableDrops,
} from '@minddrop/drops';
import { BackendUtilsApi, registerBackendUtilsAdapter } from '@minddrop/utils';
import { BookmarkDropConfig } from '../BookmarkDropConfig';

export const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop:drop:bookmark',
});

export function setup() {
  // Run the drops extension
  onRunDrops(core);

  // Register the bookmark drop type
  Drops.register(core, BookmarkDropConfig);

  // Register a mock backend utils adapter
  registerBackendUtilsAdapter({
    getWebpageMedata: async () => ({
      domain: 'minddrop.app',
      title: 'Bookmark title',
    }),
  } as BackendUtilsApi);
}

export function cleanup() {
  // Disable the drops extension
  onDisableDrops(core);
}

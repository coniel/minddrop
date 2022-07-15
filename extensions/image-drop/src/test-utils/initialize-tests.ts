import { initializeCore } from '@minddrop/core';
import {
  Drops,
  onRun as onRunDrops,
  onDisable as onDisableDrops,
} from '@minddrop/drops';
import { BackendUtilsApi, registerBackendUtilsAdapter } from '@minddrop/utils';
import { Files, FileReferencesResource } from '@minddrop/files';
import * as FilesExtension from '@minddrop/files';
import { ImageDropConfig } from '../ImageDropConfig';

export const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop:drop:image',
});

export function setup() {
  // Run the files extension
  FilesExtension.onRun(core);

  // Register a mock file storage adapter
  Files.registerStorageAdapter({
    getUrl: () => 'https://placekitten.com/1200/1200',
    save: async () => {
      return FileReferencesResource.create(core, {
        type: 'image/png',
        name: 'image.png',
        size: 200,
      });
    },
    download: async () => {
      return FileReferencesResource.create(core, {
        type: 'image/png',
        name: 'image.png',
        size: 200,
      });
    },
  });

  // Run the drops extension
  onRunDrops(core);

  // Register the image drop type
  Drops.register(core, ImageDropConfig);

  // Register a mock backend utils adapter
  registerBackendUtilsAdapter({
    getWebpageMedata: async () => ({
      domain: 'minddrop.app',
      title: 'Image title',
    }),
  } as BackendUtilsApi);
}

export function cleanup() {
  // Disable the drops extension
  onDisableDrops(core);

  // Disable the files extension
  FilesExtension.onDisable(core);

  // Unregister the storage adapter
  Files.unregisterStorageAdapter();
}

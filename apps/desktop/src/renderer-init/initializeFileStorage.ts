import { initializeCore } from '@minddrop/core';
import { Files } from '@minddrop/files';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

export function initializeFileStorage() {
  Files.addEventListener(core, 'files:file:save', (payload) => {
    const { file, fileReference } = payload.data;
    window.files.create(file, fileReference.id);
  });
}

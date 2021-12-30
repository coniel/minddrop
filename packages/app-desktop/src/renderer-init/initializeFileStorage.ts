import { initializeCore } from '@minddrop/core';
import { Files } from '@minddrop/files';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

export function initializeFileStorage() {
  Files.addEventListener(core, 'files:create', (payload) => {
    const { file, reference } = payload.data;
    window.files.create(file, reference.id);
  });
}

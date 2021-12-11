import { initializeCore } from '@minddrop/core';
import { Files } from '@minddrop/files';

const core = initializeCore('app');

export function initializeFileStorage() {
  Files.addEventListener(core, 'files:create', (payload) => {
    const { file, reference } = payload.data;
    console.log(window.files);
    window.files.create(file, reference.id);
  });
}

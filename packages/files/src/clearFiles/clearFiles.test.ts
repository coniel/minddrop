import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from '../extension';
import { clearFileReferences } from './clearFiles';

let core = initializeCore('files');

// Set up extension
onRun(core);

describe('clearFileReferences', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('files');
    onRun(core);
  });

  it("dispatches a 'files:clear' event", () => {
    const callback = jest.fn();

    core.addEventListener('files:clear', callback);

    clearFileReferences(core);

    expect(callback).toHaveBeenCalled();
  });
});

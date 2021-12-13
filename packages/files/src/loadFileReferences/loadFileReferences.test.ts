import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from '../files-extension';
import { loadFileReferences } from './loadFileReferences';
import { generateFileReference } from '../generateFileReference';
import { textFile } from '@minddrop/test-utils';

let core = initializeCore('files');

// Set up extension
onRun(core);

describe('loadFileReferences', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('files');
    onRun(core);
  });

  it("dispatches a 'files:load' event", async () => {
    const callback = jest.fn();
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(textFile);
    const files = [file1, file2];

    core.addEventListener('files:load', callback);

    loadFileReferences(core, files);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toEqual(files);
  });
});

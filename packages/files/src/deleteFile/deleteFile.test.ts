import { initializeCore } from '@minddrop/core';
import { act, textFile } from '@minddrop/test-utils';
import { onDisable, onRun } from '../files-extension';
import { createFile } from '../createFile';
import { FileReference } from '../types';
import { deleteFile } from './deleteFile';

let core = initializeCore('files');

// Set up extension
onRun(core);

describe('deleteFile', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('files');
    onRun(core);
  });

  it("dispatches a 'files:delete' event", async () => {
    const callback = jest.fn();
    let file: FileReference;

    core.addEventListener('files:delete', callback);

    await act(async () => {
      file = await createFile(core, textFile);
    });

    deleteFile(core, file.id);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toBe(file);
  });
});

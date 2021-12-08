import { initializeCore } from '@minddrop/core';
import { imageFile, textFile } from '@minddrop/test-utils';
import { createFile } from './createFile';

let core = initializeCore('files');

describe('createFile', () => {
  afterEach(() => {
    core = initializeCore('files');
  });

  it('retunrs a file reference', async () => {
    const ref = await createFile(core, textFile);

    expect(ref).toBeDefined();
    expect(ref.name).toBe('text.txt');
  });

  it("dispatches a 'files:create' event", async () => {
    const callback = jest.fn();

    core.addEventListener('files:create', callback);

    const ref = await createFile(core, imageFile);

    expect(callback).toHaveBeenCalledWith({
      source: 'files',
      type: 'files:create',
      data: {
        file: imageFile,
        reference: ref,
      },
    });
  });
});

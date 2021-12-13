import { initializeCore } from '@minddrop/core';
import { act, renderHook, textFile } from '@minddrop/test-utils';
import { createFile } from '../createFile';
import { FileReference } from '../types';
import { deleteFile } from './deleteFile';
import { clearFileReferences } from '../clearFileReferences';
import { useAllFileReferences } from '../useAllFileReferences';

let core = initializeCore('files');

describe('deleteFile', () => {
  afterEach(() => {
    core = initializeCore('files');
    act(() => {
      clearFileReferences(core);
    });
  });

  it('removes the file reference from the store', async () => {
    const { result } = renderHook(() => useAllFileReferences());
    let ref: FileReference;

    await act(async () => {
      ref = await createFile(core, textFile);
      ref = deleteFile(core, ref.id);
    });

    expect(result.current[ref.id]).not.toBeDefined();
  });

  it("dispatches a 'files:delete' event", (done) => {
    let file: FileReference;

    function callback(payload) {
      expect(payload.data).toEqual(file);
      done();
    }

    core.addEventListener('files:delete', callback);

    async function run() {
      await act(async () => {
        file = await createFile(core, textFile);
        file = deleteFile(core, file.id);
      });
    }

    run();
  });
});

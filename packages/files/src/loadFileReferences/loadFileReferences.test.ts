import { initializeCore } from '@minddrop/core';
import { loadFileReferences } from './loadFileReferences';
import { generateFileReference } from '../generateFileReference';
import { act, renderHook, textFile } from '@minddrop/test-utils';
import { useAllFileReferences } from '../useAllFileReferences';
import { FileReference } from '../types';
import { clearFileReferences } from '../clearFileReferences';

let core = initializeCore('files');

describe('loadFileReferences', () => {
  afterEach(() => {
    core = initializeCore('files');
    act(() => {
      clearFileReferences(core);
    });
  });

  it('adds files references to the store', async () => {
    const { result } = renderHook(() => useAllFileReferences());
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(textFile);

    act(() => {
      loadFileReferences(core, [file1, file2]);
    });

    expect(result.current[file1.id]).toEqual(file1);
    expect(result.current[file2.id]).toEqual(file2);
  });

  it("dispatches a 'files:load' event", (done) => {
    let file1: FileReference;
    let file2: FileReference;

    function callback(payload) {
      expect(payload.data).toEqual([file1, file2]);
      done();
    }

    core.addEventListener('files:load', callback);

    async function run() {
      file1 = await generateFileReference(textFile);
      file2 = await generateFileReference(textFile);

      act(() => {
        loadFileReferences(core, [file1, file2]);
      });
    }

    run();
  });
});

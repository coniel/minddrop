import { act, renderHook, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { clearFileReferences } from './clearFileReferences';
import { useAllFileReferences } from '../useAllFileReferences';
import { generateFileReference } from '../generateFileReference';
import { loadFileReferences } from '../loadFileReferences';

let core = initializeCore('files');

describe('clearFileReferences', () => {
  afterEach(() => {
    core = initializeCore('files');
    act(() => {
      clearFileReferences(core);
    });
  });

  it('clears file references from the store', async () => {
    const { result } = renderHook(() => useAllFileReferences());
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(textFile);

    act(() => {
      loadFileReferences(core, [file1, file2]);
      clearFileReferences(core);
    });

    expect(result.current[file1.id]).not.toBeDefined();
    expect(result.current[file2.id]).not.toBeDefined();
  });

  it("dispatches a 'files:clear' event", (done) => {
    function callback() {
      done();
    }

    core.addEventListener('files:clear', callback);

    act(() => {
      clearFileReferences(core);
    });
  });
});

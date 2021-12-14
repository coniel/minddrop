import { act, renderHook, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { updateFileReference } from './updateFileReference';
import { FileReference } from '../types';
import { createFile } from '../createFile';
import { useAllFileReferences } from '../useAllFileReferences';
import { clearFileReferences } from '../clearFileReferences';

const core = initializeCore('files');

describe('updateFileReference', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    act(() => {
      clearFileReferences(core);
    });
  });

  it('updates the file reference in the store', async () => {
    const { result } = renderHook(() => useAllFileReferences());
    let ref: FileReference;

    await act(async () => {
      ref = await createFile(core, textFile);
      updateFileReference(core, ref.id, { attachedTo: ['drop-id'] });
    });

    expect(result.current[ref.id].attachedTo).toEqual(['drop-id']);
  });

  it("dispatches a 'files:update-file-reference' event", (done) => {
    let ref: FileReference;
    let updated: FileReference;

    function callback(payload) {
      expect(payload.data).toEqual({
        before: ref,
        after: updated,
        changes: { attachedTo: ['drop-id'] },
      });
      done();
    }

    core.addEventListener('files:update-file-reference', callback);

    async function run() {
      ref = await createFile(core, textFile);
      updated = updateFileReference(core, ref.id, { attachedTo: ['drop-id'] });
    }

    run();
  });
});

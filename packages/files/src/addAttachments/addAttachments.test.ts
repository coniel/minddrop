import { act, renderHook, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { createFile } from '../createFile';
import { FileReference } from '../types';
import { clearFileReferences } from '../clearFileReferences';
import { addAttachments } from './addAttachments';
import { useAllFileReferences } from '../useAllFileReferences';

const core = initializeCore({ appId: 'app-id', extensionId: 'files' });

describe('addAttachments', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    act(() => {
      clearFileReferences(core);
    });
  });

  it('adds the resource IDs to attachedTo', async () => {
    const { result } = renderHook(() => useAllFileReferences());
    let ref: FileReference;
    let updated: FileReference;

    await act(async () => {
      ref = await createFile(core, textFile);
      updated = addAttachments(core, ref.id, ['drop-id']);
    });

    expect(updated.attachedTo).toEqual(['drop-id']);
    expect(result.current[ref.id].attachedTo).toEqual(['drop-id']);
  });

  it("dispatches a 'files:add-attachments' event", (done) => {
    let ref: FileReference;
    let updated: FileReference;

    function callback(payload) {
      expect(payload.data).toEqual({
        reference: updated,
        resourceIds: ['drop-id'],
      });
      done();
    }

    core.addEventListener('files:add-attachments', callback);

    async function run() {
      await act(async () => {
        ref = await createFile(core, textFile);
        updated = addAttachments(core, ref.id, ['drop-id']);
      });
    }

    run();
  });
});

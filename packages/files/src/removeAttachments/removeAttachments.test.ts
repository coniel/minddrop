import { act, renderHook, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { createFile } from '../createFile';
import { FileReference } from '../types';
import { clearFileReferences } from '../clearFileReferences';
import { removeAttachments } from './removeAttachments';
import { useAllFileReferences } from '../useAllFileReferences';
import { FieldValue } from '@minddrop/utils';

const core = initializeCore('files');

describe('removeAttachments', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    act(() => {
      clearFileReferences(core);
    });
  });

  it('removes the resource IDs from attachedTo', async () => {
    const { result } = renderHook(() => useAllFileReferences());
    let ref: FileReference;
    let updated: FileReference;

    await act(async () => {
      ref = await createFile(core, textFile, ['drop-id', 'drop-2-id']);
      updated = removeAttachments(core, ref.id, ['drop-id']);
    });

    expect(updated.attachedTo).toEqual(['drop-2-id']);
    expect(result.current[ref.id].attachedTo).toEqual(['drop-2-id']);
  });

  it('deletes the file if `attachedTo` becomes empty', async () => {
    const { result } = renderHook(() => useAllFileReferences());
    let ref: FileReference;

    await act(async () => {
      ref = await createFile(core, textFile, ['drop-id']);
      removeAttachments(core, ref.id, ['drop-id']);
    });

    expect(result.current[ref.id]).not.toBeDefined();
  });

  it("dispatches a 'files:remove-attachments' event", (done) => {
    let ref: FileReference;
    let updated: FileReference;

    function callback(payload) {
      expect(payload.data).toEqual({
        reference: updated,
        resourceIds: ['drop-id'],
      });
      done();
    }

    core.addEventListener('files:remove-attachments', callback);

    async function run() {
      await act(async () => {
        ref = await createFile(core, textFile, ['drop-id', 'drop-2-id']);
        updated = removeAttachments(core, ref.id, ['drop-id']);
      });
    }

    run();
  });

  it("does not dispatch 'files:remove-attachments' or 'files:update-file-reference' events if `attachedTo` becomes empty", async () => {
    jest.spyOn(core, 'dispatch');
    let ref: FileReference;
    let updated: FileReference;

    await act(async () => {
      ref = await createFile(core, textFile, ['drop-id']);
      updated = removeAttachments(core, ref.id, ['drop-id']);
    });

    expect(core.dispatch).not.toHaveBeenCalledWith(
      'files:update-file-reference',
      {
        before: ref,
        after: updated,
        changes: {
          attachedTo: FieldValue.arrayRemove(['drop-id']),
        },
      },
    );
    expect(core.dispatch).not.toHaveBeenCalledWith('files:remove-attachments', {
      reference: updated,
      resourceIds: ['drop-id'],
    });
  });
});

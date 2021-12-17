import { act, renderHook, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { createFile } from '../createFile';
import { FileReference } from '../types';
import { clearFileReferences } from '../clearFileReferences';
import { replaceAttachments } from './replaceAttachments';
import { useAllFileReferences } from '../useAllFileReferences';

const core = initializeCore({ appId: 'app-id', extensionId: 'files' });

describe('replaceAttachments', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    act(() => {
      clearFileReferences(core);
    });
  });

  it('replaces the resource IDs from attachedTo', async () => {
    const { result } = renderHook(() => useAllFileReferences());
    let ref: FileReference;
    let updated: FileReference;

    await act(async () => {
      ref = await createFile(core, textFile, ['drop-id', 'drop-2-id']);
      updated = replaceAttachments(core, ref.id, ['drop-3-id']);
    });

    expect(updated.attachedTo).toEqual(['drop-3-id']);
    expect(result.current[ref.id].attachedTo).toEqual(['drop-3-id']);
  });

  it('deletes the file if `attachedTo` becomes empty', async () => {
    const { result } = renderHook(() => useAllFileReferences());
    let ref: FileReference;

    await act(async () => {
      ref = await createFile(core, textFile, ['drop-id']);
      replaceAttachments(core, ref.id, []);
    });

    expect(result.current[ref.id]).not.toBeDefined();
  });

  it("dispatches a 'files:replace-attachments' event", (done) => {
    let ref: FileReference;
    let updated: FileReference;

    function callback(payload) {
      expect(payload.data).toEqual({
        reference: updated,
        oldResourceIds: ['drop-id', 'drop-2-id'],
        newResourceIds: ['drop-3-id'],
      });
      done();
    }

    core.addEventListener('files:replace-attachments', callback);

    async function run() {
      await act(async () => {
        ref = await createFile(core, textFile, ['drop-id', 'drop-2-id']);
        updated = replaceAttachments(core, ref.id, ['drop-3-id']);
      });
    }

    run();
  });

  it("does not dispatch 'files:replace-attachments' event if `attachedTo` becomes empty", async () => {
    jest.spyOn(core, 'dispatch');
    let ref: FileReference;
    let updated: FileReference;

    await act(async () => {
      ref = await createFile(core, textFile, ['drop-id']);
      updated = replaceAttachments(core, ref.id, []);
    });

    expect(core.dispatch).not.toHaveBeenCalledWith(
      'files:update-file-reference',
      {
        before: ref,
        after: updated,
        changes: {
          attachedTo: [],
        },
      },
    );
    expect(core.dispatch).not.toHaveBeenCalledWith(
      'files:replace-attachments',
      {
        reference: updated,
        oldResourceIds: ['drop-id'],
        newResourceIds: [],
      },
    );
  });
});

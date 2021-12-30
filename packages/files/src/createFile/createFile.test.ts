import { initializeCore } from '@minddrop/core';
import { act, imageFile, renderHook, textFile } from '@minddrop/test-utils';
import { clearFileReferences } from '../clearFileReferences';
import { FileReference } from '../types';
import { useAllFileReferences } from '../useAllFileReferences';
import { createFile } from './createFile';

let core = initializeCore({ appId: 'app-id', extensionId: 'files' });

describe('createFile', () => {
  afterEach(() => {
    core = initializeCore({ appId: 'app-id', extensionId: 'files' });
    act(() => {
      clearFileReferences(core);
    });
  });

  it('returns a file reference', async () => {
    const ref = await createFile(core, textFile, ['resource-id']);

    expect(ref).toBeDefined();
    expect(ref.name).toBe('text.txt');
    expect(ref.attachedTo).toEqual(['resource-id']);
  });

  it('adds the file reference to the store', async () => {
    const { result } = renderHook(() => useAllFileReferences());
    let ref: FileReference;

    await act(async () => {
      ref = await createFile(core, textFile);
    });

    expect(result.current[ref.id]).toEqual(ref);
  });

  it("dispatches a 'files:create' event", (done) => {
    let ref: FileReference;

    function callback(payload) {
      expect(payload.data).toEqual({
        file: imageFile,
        reference: ref,
      });
      done();
    }

    core.addEventListener('files:create', callback);

    async function run() {
      ref = await createFile(core, imageFile);
    }

    run();
  });
});

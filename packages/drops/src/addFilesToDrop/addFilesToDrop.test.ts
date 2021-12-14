import { act, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Files,
  FileReference,
  FileReferenceNotFoundError,
} from '@minddrop/files';
import { addFilesToDrop } from './addFilesToDrop';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { clearDrops } from '../clearDrops';

let core = initializeCore('drops');

describe('addFilesToDrop', () => {
  afterEach(() => {
    core = initializeCore('drops');
    act(() => {
      Files.clear(core);
      clearDrops(core);
    });
  });

  it('adds files to the drop', async () => {
    let drop: Drop;
    let fileRef: FileReference;

    await act(async () => {
      fileRef = await Files.create(core, textFile);
      drop = createDrop(core, { type: 'text' });
      drop = addFilesToDrop(core, drop.id, [fileRef.id]);
    });

    expect(drop.files).toBeDefined();
    expect(drop.files.length).toBe(1);
    expect(drop.files[0]).toBe(fileRef.id);
  });

  it('adds the drop as an attachment to the files', async () => {
    let drop: Drop;
    let file1Ref: FileReference;
    let file2Ref: FileReference;

    await act(async () => {
      file1Ref = await Files.create(core, textFile);
      file2Ref = await Files.create(core, textFile);
      drop = createDrop(core, { type: 'text' });
      drop = addFilesToDrop(core, drop.id, [file1Ref.id, file2Ref.id]);
    });

    expect(Files.get(file1Ref.id).attachedTo).toEqual([drop.id]);
    expect(Files.get(file2Ref.id).attachedTo).toEqual([drop.id]);
  });

  it('throws if file attachement does not exist', async () => {
    let drop: Drop;

    await act(async () => {
      drop = createDrop(core, { type: 'text' });
    });

    expect(() =>
      addFilesToDrop(core, drop.id, ['missing-file-id']),
    ).toThrowError(FileReferenceNotFoundError);
  });

  it("dispatches a 'drops:add-files' event", (done) => {
    let drop: Drop;
    let fileRef: FileReference;

    function callback(payload) {
      expect(payload.data).toEqual({
        drop,
        files: { [fileRef.id]: { ...fileRef, attachedTo: [drop.id] } },
      });
      done();
    }

    async function run() {
      await act(async () => {
        fileRef = await Files.create(core, textFile);
        drop = createDrop(core, { type: 'text', files: [fileRef.id] });
        drop = addFilesToDrop(core, drop.id, [fileRef.id]);
      });
    }

    core.addEventListener('drops:add-files', callback);

    run();
  });
});

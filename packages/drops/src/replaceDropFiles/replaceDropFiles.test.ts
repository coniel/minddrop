import { act, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Files,
  FileReference,
  FileReferenceNotFoundError,
} from '@minddrop/files';
import { replaceDropFiles } from './replaceDropFiles';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { clearDrops } from '../clearDrops';
import { addFilesToDrop } from '../addFilesToDrop';

let core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

describe('replaceDropFiles', () => {
  afterEach(() => {
    core = initializeCore({ appId: 'app-id', extensionId: 'drops' });
    act(() => {
      clearDrops(core);
      Files.clear(core);
    });
  });

  it("replaces the drop's files", async () => {
    let drop: Drop;
    let fileRef1: FileReference;
    let fileRef2: FileReference;

    await act(async () => {
      fileRef1 = await Files.create(core, textFile);
      fileRef2 = await Files.create(core, textFile);
      drop = createDrop(core, { type: 'text', files: [fileRef1.id] });
      drop = replaceDropFiles(core, drop.id, [fileRef2.id]);
    });

    expect(drop.files).toBeDefined();
    expect(drop.files.length).toBe(1);
    expect(drop.files[0]).toBe(fileRef2.id);
  });

  it('throws if file attachement does not exist', async () => {
    let drop: Drop;

    await act(async () => {
      drop = createDrop(core, { type: 'text' });
    });
    expect(() =>
      replaceDropFiles(core, drop.id, ['missing-file-id']),
    ).toThrowError(FileReferenceNotFoundError);
  });

  it('adds/removes the drop as an attachment from', async () => {
    let drop: Drop;
    let file1Ref: FileReference;
    let file2Ref: FileReference;
    let file3Ref: FileReference;
    let file4Ref: FileReference;

    await act(async () => {
      drop = createDrop(core, { type: 'text' });
      file1Ref = await Files.create(core, textFile, ['resource-id']);
      file2Ref = await Files.create(core, textFile, ['resource-id']);
      file3Ref = await Files.create(core, textFile);
      file4Ref = await Files.create(core, textFile);
      drop = addFilesToDrop(core, drop.id, [file1Ref.id, file2Ref.id]);
      drop = replaceDropFiles(core, drop.id, [file3Ref.id, file4Ref.id]);
    });

    expect(Files.get(file1Ref.id).attachedTo).toEqual(['resource-id']);
    expect(Files.get(file2Ref.id).attachedTo).toEqual(['resource-id']);
    expect(Files.get(file3Ref.id).attachedTo).toEqual([drop.id]);
    expect(Files.get(file4Ref.id).attachedTo).toEqual([drop.id]);
  });

  it("dispatches a 'drops:replace-files' event", (done) => {
    let drop: Drop;
    let fileRef1: FileReference;
    let fileRef2: FileReference;

    function callback(payload) {
      expect(payload.data).toEqual({
        drop,
        removedFiles: { [fileRef1.id]: { ...fileRef1, attachedTo: [drop.id] } },
        addedFiles: { [fileRef2.id]: fileRef2 },
      });
      done();
    }

    core.addEventListener('drops:replace-files', callback);

    async function run() {
      await act(async () => {
        fileRef1 = await Files.create(core, textFile);
        fileRef2 = await Files.create(core, textFile);
        drop = createDrop(core, { type: 'text', files: [fileRef1.id] });
        drop = replaceDropFiles(core, drop.id, [fileRef2.id]);
      });
    }

    run();
  });
});

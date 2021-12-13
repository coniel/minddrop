import { act, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { Files, FileReference } from '@minddrop/files';
import { removeFilesFromDrop } from './removeFilesFromDrop';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { addFilesToDrop } from '../addFilesToDrop';
import { clearDrops } from '../clearDrops';

let core = initializeCore('drops');

describe('removeFilesFromDrop', () => {
  afterEach(() => {
    core = initializeCore('drops');
    act(() => {
      Files.clear(core);
      clearDrops(core);
    });
  });

  it('removes files from the drop', async () => {
    let drop: Drop;
    let fileRef1: FileReference;
    let fileRef2: FileReference;

    await act(async () => {
      fileRef1 = await Files.create(core, textFile);
      fileRef2 = await Files.create(core, textFile);
      drop = createDrop(core, { type: 'text' });
      drop = addFilesToDrop(core, drop.id, [fileRef1.id, fileRef2.id]);
      drop = removeFilesFromDrop(core, drop.id, [fileRef1.id]);
    });

    expect(drop.files).toBeDefined();
    expect(drop.files.length).toBe(1);
    expect(drop.files[0]).toBe(fileRef2.id);
  });

  it('removes the files field if there are no files left', async () => {
    let drop: Drop;
    let fileRef: FileReference;

    await act(async () => {
      fileRef = await Files.create(core, textFile);
      drop = createDrop(core, { type: 'text' });
      drop = addFilesToDrop(core, drop.id, [fileRef.id]);
      drop = removeFilesFromDrop(core, drop.id, [fileRef.id]);
    });

    expect(drop.files).not.toBeDefined();
  });

  it("dispatches a 'drops:remove-files' event", (done) => {
    let drop: Drop;
    let fileRef: FileReference;

    function callback(payload) {
      expect(payload.data).toEqual({ drop, files: { [fileRef.id]: fileRef } });
      done();
    }

    core.addEventListener('drops:remove-files', callback);

    async function run() {
      fileRef = await Files.create(core, textFile);
      drop = createDrop(core, { type: 'text', files: [fileRef.id] });
      drop = addFilesToDrop(core, drop.id, [fileRef.id]);
      drop = removeFilesFromDrop(core, drop.id, [fileRef.id]);
    }

    run();
  });
});

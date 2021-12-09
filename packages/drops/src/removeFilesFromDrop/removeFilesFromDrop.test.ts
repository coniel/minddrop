import { act, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Files,
  onRun as onRunFiles,
  onDisable as onDisableFiles,
  FileReference,
} from '@minddrop/files';
import { onRun, onDisable } from '../drops-extension';
import { removeFilesFromDrop } from './removeFilesFromDrop';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { addFilesToDrop } from '../addFilesToDrop';

let core = initializeCore('drops');

// Run files extension
onRunFiles(core);
// Run drops extension
onRun(core);

describe('removeFilesFromDrop', () => {
  afterEach(() => {
    core = initializeCore('drops');
    act(() => {
      onDisableFiles(core);
      onDisable(core);
      onRunFiles(core);
      onRun(core);
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

  it("dispatches a 'drops:remove-files' event", async () => {
    const callback = jest.fn();
    let drop: Drop;
    let fileRef: FileReference;

    core.addEventListener('drops:remove-files', callback);

    await act(async () => {
      fileRef = await Files.create(core, textFile);
      drop = createDrop(core, { type: 'text', files: [fileRef.id] });
      drop = addFilesToDrop(core, drop.id, [fileRef.id]);
      drop = removeFilesFromDrop(core, drop.id, [fileRef.id]);
    });

    expect(callback).toHaveBeenCalledWith({
      source: 'drops',
      type: 'drops:remove-files',
      data: { drop, files: { [fileRef.id]: fileRef } },
    });
  });
});

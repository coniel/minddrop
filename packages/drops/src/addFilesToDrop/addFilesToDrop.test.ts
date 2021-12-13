import { act, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Files,
  onRun as onRunFiles,
  onDisable as onDisableFiles,
  FileReference,
  FileReferenceNotFoundError,
} from '@minddrop/files';
import { onRun, onDisable } from '../drops-extension';
import { addFilesToDrop } from './addFilesToDrop';
import { Drop } from '../types';
import { createDrop } from '../createDrop';

let core = initializeCore('drops');

// Run files extension
onRunFiles(core);
// Run drops extension
onRun(core);

describe('addFilesToDrop', () => {
  afterEach(() => {
    core = initializeCore('drops');
    act(() => {
      onDisableFiles(core);
      onDisable(core);
      onRunFiles(core);
      onRun(core);
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

  it('throws if file attachement does not exist', async () => {
    let drop: Drop;

    await act(async () => {
      drop = createDrop(core, { type: 'text' });
    });
    expect(() =>
      addFilesToDrop(core, drop.id, ['missing-file-id']),
    ).toThrowError(FileReferenceNotFoundError);
  });

  it("dispatches a 'drops:add-files' event", async () => {
    const callback = jest.fn();
    let drop: Drop;
    let fileRef: FileReference;

    core.addEventListener('drops:add-files', callback);

    await act(async () => {
      fileRef = await Files.create(core, textFile);
      drop = createDrop(core, { type: 'text', files: [fileRef.id] });
      drop = addFilesToDrop(core, drop.id, [fileRef.id]);
    });

    expect(callback).toHaveBeenCalledWith({
      source: 'drops',
      type: 'drops:add-files',
      data: { drop, files: { [fileRef.id]: fileRef } },
    });
  });
});

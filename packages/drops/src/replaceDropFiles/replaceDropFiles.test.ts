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
import { replaceDropFiles } from './replaceDropFiles';
import { Drop } from '../types';
import { createDrop } from '../createDrop';

let core = initializeCore('drops');

// Run files extension
onRunFiles(core);
// Run drops extension
onRun(core);

describe('replaceDropFiles', () => {
  afterEach(() => {
    core = initializeCore('drops');
    act(() => {
      onDisableFiles(core);
      onDisable(core);
      onRunFiles(core);
      onRun(core);
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

  it("dispatches a 'drops:replace-files' event", async () => {
    const callback = jest.fn();
    let drop: Drop;
    let fileRef1: FileReference;
    let fileRef2: FileReference;

    core.addEventListener('drops:replace-files', callback);

    await act(async () => {
      fileRef1 = await Files.create(core, textFile);
      fileRef2 = await Files.create(core, textFile);
      drop = createDrop(core, { type: 'text', files: [fileRef1.id] });
      drop = replaceDropFiles(core, drop.id, [fileRef2.id]);
    });

    expect(callback).toHaveBeenCalledWith({
      source: 'drops',
      type: 'drops:replace-files',
      data: {
        drop,
        removedFiles: { [fileRef1.id]: fileRef1 },
        addedFiles: { [fileRef2.id]: fileRef2 },
      },
    });
  });
});

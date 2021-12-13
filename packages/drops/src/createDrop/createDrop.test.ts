import { act, textFile } from '@minddrop/test-utils';
import {
  Files,
  onRun as onRunFiles,
  onDisable as onDisableFiles,
  FileReference,
  FileReferenceNotFoundError,
} from '@minddrop/files';
import {
  Tags,
  onRun as onRunTags,
  onDisable as onDisableTags,
  Tag,
  TagNotFoundError,
} from '@minddrop/tags';
import { initializeCore } from '@minddrop/core';
import { createDrop } from './createDrop';
import { Drop } from '../types';
import { onDisable, onRun } from '../drops-extension';

let core = initializeCore('drops');

// Run files extension
onRunFiles(core);
// Run tags extension
onRunTags(core);
// Run drops extension
onRun(core);

describe('createDrop', () => {
  afterEach(() => {
    core = initializeCore('drops');
    act(() => {
      onDisableFiles(core);
      onDisableTags(core);
      onDisable(core);
      onRunFiles(core);
      onRunTags(core);
      onRun(core);
    });
  });

  it('creates a drop', () => {
    const drop = createDrop(core, { type: 'text', markdown: 'Hello' });

    expect(drop).toBeDefined();
    expect(drop.type).toBe('text');
    expect(drop.markdown).toBe('Hello');
    expect(drop.files).not.toBeDefined();
  });

  it('supports file attachements', async () => {
    let drop: Drop;
    let fileRef: FileReference;

    await act(async () => {
      fileRef = await Files.create(core, textFile);
      drop = createDrop(core, { type: 'text', files: [fileRef.id] });
    });

    expect(drop.files).toBeDefined();
    expect(drop.files.length).toBe(1);
    expect(drop.files[0]).toBe(fileRef.id);
  });

  it('throws if file attachement does not exist', async () => {
    expect(() =>
      createDrop(core, { type: 'text', files: ['missing-file-id'] }),
    ).toThrowError(FileReferenceNotFoundError);
  });

  it('supports tags', () => {
    let drop: Drop;
    let tag: Tag;

    act(() => {
      tag = Tags.create(core, { label: 'tag' });
      drop = createDrop(core, { type: 'text', tags: [tag.id] });
    });

    expect(drop.tags).toBeDefined();
    expect(drop.tags.length).toBe(1);
    expect(drop.tags[0]).toBe(tag.id);
  });

  it('throws if tag does not exist', async () => {
    expect(() =>
      createDrop(core, { type: 'text', tags: ['missing-tag-id'] }),
    ).toThrowError(TagNotFoundError);
  });

  it("dispatches a 'drops:create' event", () => {
    const callback = jest.fn();

    core.addEventListener('drops:create', callback);

    const drop = createDrop(core, { type: 'text' });

    expect(callback).toHaveBeenCalledWith({
      source: 'drops',
      type: 'drops:create',
      data: drop,
    });
  });
});

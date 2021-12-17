import { act, textFile, renderHook } from '@minddrop/test-utils';
import {
  Files,
  FileReference,
  FileReferenceNotFoundError,
} from '@minddrop/files';
import { Tags, Tag, TagNotFoundError } from '@minddrop/tags';
import { initializeCore } from '@minddrop/core';
import { createDrop } from './createDrop';
import { Drop } from '../types';
import { useAllDrops } from '../useAllDrops';
import { clearDrops } from '../clearDrops';

let core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

describe('createDrop', () => {
  afterEach(() => {
    core = initializeCore({ appId: 'app-id', extensionId: 'drops' });
    act(() => {
      clearDrops(core);
      Files.clear(core);
      Tags.clear(core);
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

  it('adds the drop as an attachment to files', async () => {
    let drop: Drop;
    let file1Ref: FileReference;
    let file2Ref: FileReference;

    await act(async () => {
      file1Ref = await Files.create(core, textFile);
      file2Ref = await Files.create(core, textFile);
      drop = createDrop(core, {
        type: 'text',
        files: [file1Ref.id, file2Ref.id],
      });
    });

    expect(Files.get(file1Ref.id).attachedTo).toEqual([drop.id]);
    expect(Files.get(file2Ref.id).attachedTo).toEqual([drop.id]);
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

  it('adds the drop to the store', () => {
    const { result } = renderHook(() => useAllDrops());
    let drop: Drop;

    act(() => {
      drop = createDrop(core, { type: 'text' });
    });

    expect(result.current[drop.id]).toEqual(drop);
  });

  it("dispatches a 'drops:create' event", (done) => {
    let drop: Drop;

    function callback(payload) {
      expect(payload.data).toEqual(drop);
      done();
    }

    core.addEventListener('drops:create', callback);

    act(() => {
      drop = createDrop(core, { type: 'text' });
    });
  });
});

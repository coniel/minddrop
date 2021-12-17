import { initializeCore } from '@minddrop/core';
import { act, renderHook } from '@minddrop/test-utils';
import { clearTags } from '../clearTags';
import { Tag } from '../types';
import { useAllTags } from '../useAllTags';
import { createTag } from './createTag';

const core = initializeCore({ appId: 'app-id', extensionId: 'tags' });

describe('createTag', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    act(() => {
      clearTags(core);
    });
  });

  it('creates a tag', () => {
    const tag = createTag(core, { label: 'Book', color: 'red' });

    expect(tag).toBeDefined();
    expect(tag.label).toBe('Book');
    expect(tag.color).toBe('red');
  });

  it('adds tag to the store', () => {
    const { result } = renderHook(() => useAllTags());
    let tag: Tag;

    act(() => {
      tag = createTag(core, { label: 'Tag' });
    });

    expect(result.current[tag.id]).toEqual(tag);
  });

  it("dispatches a 'tags:create' event", (done) => {
    let tag: Tag;

    function callback(payload) {
      expect(payload.data).toEqual(tag);
      done();
    }

    core.addEventListener('tags:create', callback);

    act(() => {
      tag = createTag(core, { label: 'My tag' });
    });
  });
});

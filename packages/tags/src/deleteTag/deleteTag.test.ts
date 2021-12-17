import { initializeCore } from '@minddrop/core';
import { act, renderHook } from '@minddrop/test-utils';
import { createTag } from '../createTag';
import { Tag } from '../types';
import { deleteTag } from './deleteTag';
import { clearTags } from '../clearTags';
import { useAllTags } from '../useAllTags';

const core = initializeCore({ appId: 'app-id', extensionId: 'tags' });

describe('deleteTag', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    act(() => {
      clearTags(core);
    });
  });

  it('removes tag from the store', () => {
    const { result } = renderHook(() => useAllTags());
    let tag: Tag;

    act(() => {
      tag = createTag(core, { label: 'Tag' });
      deleteTag(core, tag.id);
    });

    expect(result.current[tag.id]).not.toBeDefined();
  });

  it("dispatches a 'tags:delete' event", (done) => {
    let tag: Tag;

    function callback(payload) {
      expect(payload.data).toEqual(tag);
      done();
    }

    core.addEventListener('tags:delete', callback);

    act(() => {
      tag = createTag(core, { label: 'Book' });
      tag = deleteTag(core, tag.id);
    });
  });
});

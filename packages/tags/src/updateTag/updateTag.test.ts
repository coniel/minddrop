import { act, renderHook } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { updateTag } from './updateTag';
import { Tag, UpdateTagData } from '../types';
import { useAllTags } from '../useAllTags';
import { createTag } from '../createTag';
import { clearTags } from '../clearTags';

const core = initializeCore({ appId: 'app-id', extensionId: 'tags' });

describe('updateTag', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    act(() => {
      clearTags(core);
    });
  });

  it('returns the updated tag', () => {
    const changes: UpdateTagData = { color: 'red' };
    let tag: Tag;

    act(() => {
      tag = createTag(core, { label: 'Tag', color: 'blue' });
      tag = updateTag(core, tag.id, changes);
    });

    expect(tag.color).toBe('red');
  });

  it('updates the tag in the store', () => {
    const { result } = renderHook(() => useAllTags());
    let tag: Tag;

    act(() => {
      tag = createTag(core, { label: 'Tag' });
      tag = updateTag(core, tag.id, { lable: 'Updated tag' });
    });

    expect(result.current[tag.id]).toEqual(tag);
  });

  it("dispatches a 'tags:update' event", (done) => {
    const changes: UpdateTagData = { label: 'My tag' };
    let tag: Tag;
    let updated: Tag;

    function callback(payload) {
      expect(payload.data).toEqual({
        before: tag,
        after: updated,
        changes,
      });
      done();
    }

    core.addEventListener('tags:update', callback);

    act(() => {
      tag = createTag(core, { label: 'Tag' });
      updated = updateTag(core, tag.id, changes);
    });
  });
});

import { initializeCore } from '@minddrop/core';
import { act, renderHook } from '@minddrop/test-utils';
import { createTag } from '../createTag';
import { Tag } from '../types';
import { useAllTags } from '../useAllTags';
import { clearTags } from './clearTags';

const core = initializeCore({ appId: 'app-id', extensionId: 'tags' });

describe('clearTags', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    act(() => {
      clearTags(core);
    });
  });

  it('clears the topics from the store', () => {
    const { result } = renderHook(() => useAllTags());
    let tag1: Tag;
    let tag2: Tag;

    act(() => {
      tag1 = createTag(core, { label: 'tag 1' });
      tag2 = createTag(core, { label: 'tag 2' });
      clearTags(core);
    });

    expect(result.current[tag1.id]).not.toBeDefined();
    expect(result.current[tag2.id]).not.toBeDefined();
  });

  it("dispatches a 'tags:clear' event", (done) => {
    function callback() {
      done();
    }

    core.addEventListener('tags:clear', callback);

    act(() => {
      clearTags(core);
    });
  });
});

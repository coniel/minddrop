import { act, renderHook } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { loadTags } from './loadTags';
import { generateTag } from '../generateTag';
import { useAllTags } from '../useAllTags';
import { clearTags } from '../clearTags';

const core = initializeCore('tags');

describe('loadTags', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    act(() => {
      clearTags(core);
    });
  });

  it('loads tags into the store', () => {
    const { result } = renderHook(() => useAllTags());
    const tag1 = generateTag({ label: 'Book' });
    const tag2 = generateTag({ label: 'Link' });

    act(() => {
      loadTags(core, [tag1, tag2]);
    });

    expect(result.current[tag1.id]).toEqual(tag1);
    expect(result.current[tag2.id]).toEqual(tag2);
  });

  it("dispatches a 'tags:load' event", (done) => {
    const tag1 = generateTag({ label: 'Book' });
    const tag2 = generateTag({ label: 'Link' });
    const tags = [tag1, tag2];

    function callback(payload) {
      expect(payload.data).toEqual(tags);
      done();
    }

    core.addEventListener('tags:load', callback);

    act(() => {
      loadTags(core, tags);
    });
  });
});

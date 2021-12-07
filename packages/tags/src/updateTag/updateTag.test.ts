import { act, renderHook } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { generateTag } from '../generateTag';
import { updateTag } from './updateTag';
import { useTagsStore } from '../useTagsStore';
import { UpdateTagData } from '../types';

let core = initializeCore('tags');

describe('updateTag', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTagsStore());

    act(() => {
      result.current.clear();
    });

    core = initializeCore('tags');
  });

  it('returns the updated tag', () => {
    const { result } = renderHook(() => useTagsStore());
    const changes: UpdateTagData = { color: 'red' };
    const tag = generateTag({ label: 'Book' });

    act(() => {
      result.current.addTag(tag);
    });

    const updated = updateTag(core, tag.id, changes);

    expect(updated.color).toBe('red');
  });

  it("dispatches a 'tags:update' event", () => {
    const { result } = renderHook(() => useTagsStore());
    const callback = jest.fn();
    const changes: UpdateTagData = { label: 'My tag' };
    const tag = generateTag({ label: 'Tag' });

    act(() => {
      result.current.addTag(tag);
    });

    core.addEventListener('tags:update', callback);

    updateTag(core, tag.id, changes);

    expect(callback).toHaveBeenCalledWith({
      source: 'tags',
      type: 'tags:update',
      data: {
        before: tag,
        after: { ...tag, ...changes },
        changes,
      },
    });
  });
});

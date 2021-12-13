import { act, renderHook } from '@minddrop/test-utils';
import { getTag } from './getTag';
import { useTagsStore } from '../useTagsStore';
import { generateTag } from '../generateTag';
import { TagNotFoundError } from '../errors';

describe('getTag', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTagsStore());

    act(() => {
      result.current.clear();
    });
  });

  it('returns the tag matching the id', () => {
    const { result } = renderHook(() => useTagsStore());

    const tag = generateTag({ label: 'Books' });

    act(() => {
      result.current.addTag(tag);
    });

    expect(getTag(tag.id)).toBe(tag);
  });

  it('throws a TagNotFoundError if the tag does not exist', () => {
    expect(() => getTag('id')).toThrowError(TagNotFoundError);
  });
});

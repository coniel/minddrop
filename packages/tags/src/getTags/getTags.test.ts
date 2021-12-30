import { act, renderHook } from '@minddrop/test-utils';
import { getTags } from './getTags';
import { useTagsStore } from '../useTagsStore';
import { generateTag } from '../generateTag';
import { TagNotFoundError } from '../errors';

describe('getTags', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTagsStore());

    act(() => {
      result.current.clear();
    });
  });

  it('returns the tags matching the ids', () => {
    const { result } = renderHook(() => useTagsStore());

    const tag1 = generateTag({ label: 'Book' });
    const tag2 = generateTag({ label: 'Link' });
    const tag3 = generateTag({ label: 'Important' });

    act(() => {
      result.current.setTag(tag1);
      result.current.setTag(tag2);
      result.current.setTag(tag3);
    });

    const tags = getTags([tag1.id, tag2.id]);

    expect(Object.keys(tags).length).toBe(2);
    expect(tags[tag1.id]).toEqual(tag1);
    expect(tags[tag2.id]).toEqual(tag2);
  });

  it('throws a TagNotFoundError if the tag does not exist', () => {
    expect(() => getTags(['id'])).toThrowError(TagNotFoundError);
  });
});

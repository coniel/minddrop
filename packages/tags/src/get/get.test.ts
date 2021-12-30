import { act, renderHook } from '@minddrop/test-utils';
import { get } from './get';
import { useTagsStore } from '../useTagsStore';
import { generateTag } from '../generateTag';

describe('get', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTagsStore());

    act(() => {
      result.current.clear();
    });
  });

  describe('given an array of IDs', () => {
    it('returns tag map', () => {
      const { result } = renderHook(() => useTagsStore());

      const tag1 = generateTag({ label: 'Book' });
      const tag2 = generateTag({ label: 'Link' });
      const tag3 = generateTag({ label: 'Important' });

      act(() => {
        result.current.setTag(tag1);
        result.current.setTag(tag2);
        result.current.setTag(tag3);
      });

      const tags = get([tag1.id, tag2.id]);

      expect(Object.keys(tags).length).toBe(2);
      expect(tags[tag1.id]).toEqual(tag1);
      expect(tags[tag2.id]).toEqual(tag2);
    });
  });

  describe('given a single ID', () => {
    it('returns a single tag', () => {
      const { result } = renderHook(() => useTagsStore());

      const tag = generateTag({ label: 'Book' });

      act(() => {
        result.current.setTag(tag);
      });

      expect(get(tag.id)).toBe(tag);
    });
  });
});

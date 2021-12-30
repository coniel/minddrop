import { act, renderHook } from '@minddrop/test-utils';
import { getAllTags } from './getAllTags';
import { useTagsStore } from '../useTagsStore';
import { generateTag } from '../generateTag';

describe('getAllTags', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTagsStore());

    act(() => {
      result.current.clear();
    });
  });

  it('returns all tags', () => {
    const { result } = renderHook(() => useTagsStore());

    const tag1 = generateTag({ label: 'Book' });
    const tag2 = generateTag({ label: 'Link' });
    const tag3 = generateTag({ label: 'Important' });

    act(() => {
      result.current.setTag(tag1);
      result.current.setTag(tag2);
      result.current.setTag(tag3);
    });

    const tags = getAllTags();

    expect(Object.keys(tags).length).toBe(3);
  });
});

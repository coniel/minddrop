import { renderHook, act } from '@minddrop/test-utils';
import { generateTag } from '../generateTag';
import { useTagsStore } from '../useTagsStore';
import { useAllTags } from './useAllTags';

describe('useAllTags', () => {
  it('returns all tags', () => {
    const { result: store } = renderHook(() => useTagsStore((state) => state));
    const tag1 = generateTag({ label: 'Book' });
    const tag2 = generateTag({ label: 'Link' });
    const tag3 = generateTag({ label: 'Important' });
    const { result } = renderHook(() => useAllTags());

    act(() => {
      store.current.loadTags([tag1, tag2, tag3]);
    });

    expect(result.current[tag1.id]).toEqual(tag1);
    expect(result.current[tag2.id]).toEqual(tag2);
    expect(result.current[tag3.id]).toEqual(tag3);
  });
});

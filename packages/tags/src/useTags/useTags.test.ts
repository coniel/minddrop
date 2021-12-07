import { renderHook, act } from '@minddrop/test-utils';
import { generateTag } from '../generateTag';
import { useTagsStore } from '../useTagsStore';
import { useTags } from './useTags';

describe('useTags', () => {
  it('returns tags by id', () => {
    const { result: store } = renderHook(() => useTagsStore((state) => state));
    const tag1 = generateTag({ label: 'Book' });
    const tag2 = generateTag({ label: 'Link' });
    const tag3 = generateTag({ label: 'Important' });
    const { result } = renderHook(() => useTags([tag1.id, tag2.id]));

    act(() => {
      store.current.loadTags([tag1, tag2, tag3]);
    });

    expect(result.current[tag1.id]).toEqual(tag1);
    expect(result.current[tag2.id]).toEqual(tag2);
    expect(result.current[tag3.id]).not.toBeDefined();
  });

  it('ignores non existant tags', () => {
    const { result: store } = renderHook(() => useTagsStore((state) => state));
    const tag1 = generateTag({ label: 'Book' });
    const tag2 = generateTag({ label: 'Link' });
    const { result } = renderHook(() => useTags([tag1.id, 'missing-tag']));

    act(() => {
      store.current.loadTags([tag1, tag2]);
    });

    expect(result.current['missing-tag']).not.toBeDefined();
    expect(Object.keys(result.current).length).toBe(1);
  });
});

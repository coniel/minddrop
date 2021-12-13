import { renderHook, act } from '@minddrop/test-utils';
import { generateTag } from '../generateTag';
import { useTagsStore } from '../useTagsStore';
import { useTag } from './useTag';

describe('useTag', () => {
  it('returns a tag by id', () => {
    const { result: store } = renderHook(() => useTagsStore((state) => state));
    const tag = generateTag({ label: 'Book' });
    const { result } = renderHook(() => useTag(tag.id));

    act(() => {
      store.current.loadTags([
        tag,
        generateTag({ label: 'Link' }),
        generateTag({ label: 'Important' }),
      ]);
    });

    expect(result.current).toEqual(tag);
  });

  it('returns null if tag does not exist', () => {
    const { result: store } = renderHook(() => useTagsStore((state) => state));
    const { result } = renderHook(() => useTag('tag-id'));

    act(() => {
      store.current.loadTags([
        generateTag({ label: 'Book' }),
        generateTag({ label: 'Link' }),
      ]);
    });

    expect(result.current).toBeNull();
  });
});

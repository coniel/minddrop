import { renderHook, act, MockDate } from '@minddrop/test-utils';
import { generateTag } from '../generateTag';
import { useTagsStore } from './useTagsStore';

describe('useTagStore', () => {
  afterEach(() => {
    MockDate.reset();
    const { result } = renderHook(() => useTagsStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('loads in tags', () => {
    const { result } = renderHook(() => useTagsStore((state) => state));

    act(() => {
      result.current.loadTags([
        generateTag({ label: 'Tag' }),
        generateTag({ label: 'Tag' }),
      ]);
    });

    expect(Object.keys(result.current.tags).length).toBe(2);
  });

  it('clears the store', () => {
    const { result } = renderHook(() => useTagsStore((state) => state));

    act(() => {
      result.current.loadTags([
        generateTag({ label: 'Tag' }),
        generateTag({ label: 'Tag' }),
      ]);
      result.current.clear();
    });

    expect(Object.keys(result.current.tags).length).toBe(0);
  });

  it('sets a tag', () => {
    const { result } = renderHook(() => useTagsStore((state) => state));

    act(() => {
      result.current.setTag(generateTag({ label: 'Tag' }));
    });

    expect(Object.keys(result.current.tags).length).toBe(1);
  });

  it('removes a tag', () => {
    const tag = generateTag({ label: 'Tag' });
    const { result } = renderHook(() => useTagsStore((state) => state));

    act(() => {
      result.current.loadTags([tag, generateTag({ label: 'Tag' })]);
      result.current.removeTag(tag.id);
    });

    expect(Object.keys(result.current.tags).length).toBe(1);
  });
});

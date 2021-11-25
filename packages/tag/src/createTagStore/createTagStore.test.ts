import { renderHook, act, MockDate } from '@minddrop/test-utils';
import { generateTag } from '../generateTag';
import { createTagStore } from './createTagStore';

const useTagStore = createTagStore();

describe('useTagStore', () => {
  afterEach(() => {
    MockDate.reset();
    const { result } = renderHook(() => useTagStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('loads in tags', () => {
    const { result } = renderHook(() => useTagStore((state) => state));

    act(() => {
      result.current.loadTags([generateTag('text'), generateTag('text')]);
    });

    expect(Object.keys(result.current.tags).length).toBe(2);
  });

  it('clears the store', () => {
    const { result } = renderHook(() => useTagStore((state) => state));

    act(() => {
      result.current.loadTags([generateTag('text'), generateTag('text')]);
      result.current.clear();
    });

    expect(Object.keys(result.current.tags).length).toBe(0);
  });

  it('adds a tag', () => {
    const { result } = renderHook(() => useTagStore((state) => state));

    act(() => {
      result.current.addTag(generateTag('text'));
    });

    expect(Object.keys(result.current.tags).length).toBe(1);
  });

  it('updates a tag', () => {
    const tag = generateTag('text');
    const { result } = renderHook(() => useTagStore((state) => state));

    act(() => {
      result.current.addTag(tag);
      result.current.updateTag(tag.id, { label: 'Hello world' });
    });

    expect(result.current.tags[tag.id].label).toBe('Hello world');
  });

  it('removes a tag', () => {
    const tag = generateTag('text');
    const { result } = renderHook(() => useTagStore((state) => state));

    act(() => {
      result.current.loadTags([tag, generateTag('text')]);
      result.current.removeTag(tag.id);
    });

    expect(Object.keys(result.current.tags).length).toBe(1);
  });
});

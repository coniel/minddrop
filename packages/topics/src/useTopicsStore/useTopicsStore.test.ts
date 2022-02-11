import { renderHook, act } from '@minddrop/test-utils';
import { tNavigation, topicViewColumns, tSailing } from '../test-utils';
import { useTopicsStore } from './useTopicsStore';

describe('useTopicsStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTopicsStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('loads in topics', () => {
    const { result } = renderHook(() => useTopicsStore((state) => state));

    act(() => {
      result.current.loadTopics([tSailing, tNavigation]);
    });

    expect(result.current.topics).toEqual({
      [tSailing.id]: tSailing,
      [tNavigation.id]: tNavigation,
    });
  });

  it('clears the store', () => {
    const { result } = renderHook(() => useTopicsStore((state) => state));

    act(() => {
      result.current.loadTopics([tSailing, tNavigation]);
      result.current.setView(topicViewColumns);
      result.current.clear();
    });

    expect(result.current.topics).toEqual({});
    expect(result.current.views).toEqual({});
  });

  it('sets a topic', () => {
    const { result } = renderHook(() => useTopicsStore((state) => state));

    act(() => {
      result.current.setTopic(tSailing);
    });

    expect(result.current.topics[tSailing.id]).toEqual(tSailing);
  });

  it('removes a topic', () => {
    const { result } = renderHook(() => useTopicsStore((state) => state));

    act(() => {
      result.current.loadTopics([tSailing]);
      result.current.removeTopic(tSailing.id);
    });

    expect(result.current.topics[tSailing.id]).not.toBeDefined();
  });

  it('sets a view', () => {
    const { result } = renderHook(() => useTopicsStore((state) => state));

    act(() => {
      result.current.setView(topicViewColumns);
    });

    expect(result.current.views[topicViewColumns.id]).toEqual(topicViewColumns);
  });

  it('removes a view', () => {
    const { result } = renderHook(() => useTopicsStore((state) => state));

    act(() => {
      result.current.setView(topicViewColumns);
      result.current.removeView(topicViewColumns.id);
    });

    expect(result.current.views[topicViewColumns.id]).not.toBeDefined();
  });
});

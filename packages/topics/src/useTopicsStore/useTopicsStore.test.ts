import { renderHook, act, MockDate } from '@minddrop/test-utils';
import { generateTopic } from '../generateTopic';
import { useTopicsStore } from './useTopicsStore';

describe('useTopicsStore', () => {
  afterEach(() => {
    MockDate.reset();
    const { result } = renderHook(() => useTopicsStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('loads in topics', () => {
    const { result } = renderHook(() => useTopicsStore((state) => state));

    act(() => {
      result.current.loadTopics([generateTopic(), generateTopic()]);
    });

    expect(Object.keys(result.current.topics).length).toBe(2);
  });

  it('clears the store', () => {
    const { result } = renderHook(() => useTopicsStore((state) => state));

    act(() => {
      result.current.loadTopics([generateTopic(), generateTopic()]);
      result.current.clear();
    });

    expect(Object.keys(result.current.topics).length).toBe(0);
  });

  it('sets a topic', () => {
    const { result } = renderHook(() => useTopicsStore((state) => state));

    act(() => {
      result.current.setTopic(generateTopic());
    });

    expect(Object.keys(result.current.topics).length).toBe(1);
  });

  it('removes a topic', () => {
    const topic = generateTopic();
    const { result } = renderHook(() => useTopicsStore((state) => state));

    act(() => {
      result.current.loadTopics([topic, generateTopic()]);
      result.current.removeTopic(topic.id);
    });

    expect(Object.keys(result.current.topics).length).toBe(1);
  });
});

import { renderHook, act } from '@minddrop/test-utils';
import { generateTopic } from '../generateTopic';
import { useTopicsStore } from '../useTopicsStore';
import { useAllTopics } from './useAllTopics';

describe('useAllTopics', () => {
  it('returns all topics', () => {
    const { result: store } = renderHook(() =>
      useTopicsStore((state) => state),
    );
    const topic1 = generateTopic();
    const topic2 = generateTopic();
    const topic3 = generateTopic();
    const { result } = renderHook(() => useAllTopics());

    act(() => {
      store.current.loadTopics([topic1, topic2, topic3]);
    });

    expect(result.current[topic1.id]).toEqual(topic1);
    expect(result.current[topic2.id]).toEqual(topic2);
    expect(result.current[topic3.id]).toEqual(topic3);
  });

  it('filters topics', () => {
    const { result: store } = renderHook(() =>
      useTopicsStore((state) => state),
    );
    const topic1 = generateTopic();
    const topic3 = { ...generateTopic(), deleted: true, deletedAt: new Date() };
    const { result } = renderHook(() => useAllTopics({ deleted: true }));

    act(() => {
      store.current.loadTopics([topic1, topic3]);
    });

    expect(result.current[topic1.id]).not.toBeDefined();
    expect(result.current[topic3.id]).toEqual(topic3);
  });
});

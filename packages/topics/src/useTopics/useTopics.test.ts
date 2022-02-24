import { renderHook, act } from '@minddrop/test-utils';
import { generateTopic } from '../generateTopic';
import { useTopicsStore } from '../useTopicsStore';
import { useTopics } from './useTopics';

describe('useTopics', () => {
  it('returns topics by id', () => {
    const { result: store } = renderHook(() =>
      useTopicsStore((state) => state),
    );
    const topic1 = generateTopic();
    const topic2 = generateTopic();
    const topic3 = generateTopic();
    const { result } = renderHook(() => useTopics([topic1.id, topic2.id]));

    act(() => {
      store.current.loadTopics([topic1, topic2, topic3]);
    });

    expect(result.current[topic1.id]).toEqual(topic1);
    expect(result.current[topic2.id]).toEqual(topic2);
    expect(result.current[topic3.id]).not.toBeDefined();
  });

  it('ignores non existant topics', () => {
    const { result: store } = renderHook(() =>
      useTopicsStore((state) => state),
    );
    const topic1 = generateTopic();
    const topic2 = generateTopic();
    const { result } = renderHook(() =>
      useTopics([topic1.id, 'missing-topic']),
    );

    act(() => {
      store.current.loadTopics([topic1, topic2]);
    });

    expect(result.current['missing-topic']).not.toBeDefined();
    expect(Object.keys(result.current).length).toBe(1);
  });

  it('filters topics', () => {
    const { result: store } = renderHook(() =>
      useTopicsStore((state) => state),
    );
    const topic1 = generateTopic();
    const topic3 = { ...generateTopic(), deleted: true, deletedAt: new Date() };
    const { result } = renderHook(() =>
      useTopics([topic1.id, topic3.id], { deleted: true }),
    );

    act(() => {
      store.current.loadTopics([topic1, topic3]);
    });

    expect(result.current[topic1.id]).not.toBeDefined();
    expect(result.current[topic3.id]).toEqual(topic3);
  });
});

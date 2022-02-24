import { act, renderHook } from '@minddrop/test-utils';
import { getAllTopics } from './getAllTopics';
import { useTopicsStore } from '../useTopicsStore';
import { generateTopic } from '../generateTopic';

describe('getAllTopics', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTopicsStore());

    act(() => {
      result.current.clear();
    });
  });

  it('returns all topics', () => {
    const { result } = renderHook(() => useTopicsStore());

    const topic1 = generateTopic();
    const topic2 = generateTopic();
    const topic3 = generateTopic();

    act(() => {
      result.current.setTopic(topic1);
      result.current.setTopic(topic2);
      result.current.setTopic(topic3);
    });

    const topics = getAllTopics();

    expect(Object.keys(topics).length).toBe(3);
  });

  it('filters topics', () => {
    const { result: store } = renderHook(() =>
      useTopicsStore((state) => state),
    );
    const topic1 = generateTopic();
    const topic3 = { ...generateTopic(), deleted: true, deletedAt: new Date() };

    act(() => {
      store.current.loadTopics([topic1, topic3]);
    });

    const { result } = renderHook(() => getAllTopics({ deleted: true }));

    expect(result.current[topic1.id]).not.toBeDefined();
    expect(result.current[topic3.id]).toEqual(topic3);
  });
});

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
      result.current.addTopic(topic1);
      result.current.addTopic(topic2);
      result.current.addTopic(topic3);
    });

    const topics = getAllTopics();

    expect(Object.keys(topics).length).toBe(3);
  });

  it('filters topics', () => {
    const { result: store } = renderHook(() =>
      useTopicsStore((state) => state),
    );
    const topic1 = generateTopic();
    const topic2 = {
      ...generateTopic(),
      archived: true,
      archivedAt: new Date(),
    };
    const topic3 = { ...generateTopic(), deleted: true, deletedAt: new Date() };

    act(() => {
      store.current.loadTopics([topic1, topic2, topic3]);
    });

    const { result } = renderHook(() => getAllTopics({ deleted: true }));

    expect(result.current[topic1.id]).not.toBeDefined();
    expect(result.current[topic2.id]).not.toBeDefined();
    expect(result.current[topic3.id]).toEqual(topic3);
  });
});

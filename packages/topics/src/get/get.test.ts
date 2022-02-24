import { act, renderHook } from '@minddrop/test-utils';
import { get } from './get';
import { useTopicsStore } from '../useTopicsStore';
import { generateTopic } from '../generateTopic';

describe('get', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTopicsStore());

    act(() => {
      result.current.clear();
    });
  });

  describe('given an array of IDs', () => {
    it('returns topic map', () => {
      const { result } = renderHook(() => useTopicsStore());

      const topic1 = generateTopic();
      const topic2 = generateTopic();
      const topic3 = generateTopic();

      act(() => {
        result.current.setTopic(topic1);
        result.current.setTopic(topic2);
        result.current.setTopic(topic3);
      });

      const topics = get([topic1.id, topic2.id]);

      expect(Object.keys(topics).length).toBe(2);
      expect(topics[topic1.id]).toEqual(topic1);
      expect(topics[topic2.id]).toEqual(topic2);
    });

    it('filters topics', () => {
      const { result: store } = renderHook(() =>
        useTopicsStore((state) => state),
      );
      const topic1 = generateTopic();
      const topic3 = {
        ...generateTopic(),
        deleted: true,
        deletedAt: new Date(),
      };

      act(() => {
        store.current.loadTopics([topic1, topic3]);
      });

      const { result } = renderHook(() =>
        get([topic1.id, topic3.id], { deleted: true }),
      );

      expect(result.current[topic1.id]).not.toBeDefined();
      expect(result.current[topic3.id]).toEqual(topic3);
    });
  });

  describe('given a single ID', () => {
    it('returns a single topic', () => {
      const { result } = renderHook(() => useTopicsStore());

      const topic = generateTopic();

      act(() => {
        result.current.setTopic(topic);
      });

      expect(get(topic.id)).toBe(topic);
    });

    it('throws an error if using filters', () => {
      const { result } = renderHook(() => useTopicsStore());

      const topic = generateTopic();

      act(() => {
        result.current.setTopic(topic);
      });

      // @ts-ignore
      expect(() => get(topic.id, { deleted: true })).toThrowError();
    });
  });
});

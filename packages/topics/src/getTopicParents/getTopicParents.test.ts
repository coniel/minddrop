import { act, renderHook } from '@minddrop/test-utils';
import { useTopicsStore } from '../useTopicsStore';
import { generateTopic } from '../generateTopic';
import { getTopicParents } from './getTopicParents';

describe('getTopicParents', () => {
  it("gets a topic's parents", () => {
    const { result } = renderHook(() => useTopicsStore());

    const topic1 = generateTopic();
    const topic2 = generateTopic({ subtopics: [topic1.id] });
    const topic3 = generateTopic({
      subtopics: [topic1.id, topic2.id],
      deleted: true,
      deletedAt: new Date(),
    });
    const topic4 = generateTopic();

    act(() => {
      result.current.loadTopics([topic1, topic2, topic3, topic4]);
    });

    const parents = getTopicParents(topic1.id);

    expect(Object.keys(parents).length).toBe(2);
    expect(parents[topic2.id]).toEqual(topic2);
    expect(parents[topic3.id]).toEqual(topic3);
  });

  it('filters results', () => {
    const { result } = renderHook(() => useTopicsStore());

    const topic1 = generateTopic();
    const topic2 = generateTopic({ subtopics: [topic1.id] });
    const topic3 = generateTopic({
      subtopics: [topic1.id, topic2.id],
      deleted: true,
      deletedAt: new Date(),
    });
    const topic4 = generateTopic();

    act(() => {
      result.current.loadTopics([topic1, topic2, topic3, topic4]);
    });

    const parents = getTopicParents(topic1.id, { deleted: true });

    expect(Object.keys(parents).length).toBe(1);
    expect(parents[topic2.id]).not.toBeDefined();
    expect(parents[topic3.id]).toEqual(topic3);
  });
});

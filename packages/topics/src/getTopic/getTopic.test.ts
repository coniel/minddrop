import { act, renderHook } from '@minddrop/test-utils';
import { getTopic } from './getTopic';
import { useTopicsStore } from '../useTopicsStore';
import { generateTopic } from '../generateTopic';
import { TopicNotFoundError } from '../errors';

describe('getTopic', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTopicsStore());

    act(() => {
      result.current.clear();
    });
  });

  it('returns the topic matching the id', () => {
    const { result } = renderHook(() => useTopicsStore());

    const topic = generateTopic();

    act(() => {
      result.current.addTopic(topic);
    });

    expect(getTopic(topic.id)).toBe(topic);
  });

  it('throws a TopicNotFoundError if the topic does not exist', () => {
    expect(() => getTopic('id')).toThrowError(TopicNotFoundError);
  });
});

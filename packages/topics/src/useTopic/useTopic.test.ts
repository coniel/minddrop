import { renderHook, act } from '@minddrop/test-utils';
import { generateTopic } from '../generateTopic';
import { useTopicsStore } from '../useTopicsStore';
import { useTopic } from './useTopic';

describe('useTopic', () => {
  it('returns a topic by id', () => {
    const { result: store } = renderHook(() =>
      useTopicsStore((state) => state),
    );
    const topic = generateTopic();
    const { result } = renderHook(() => useTopic(topic.id));

    act(() => {
      store.current.loadTopics([topic, generateTopic(), generateTopic()]);
    });

    expect(result.current).toEqual(topic);
  });

  it('returns null if topic does not exist', () => {
    const { result: store } = renderHook(() =>
      useTopicsStore((state) => state),
    );
    const { result } = renderHook(() => useTopic('topic-id'));

    act(() => {
      store.current.loadTopics([generateTopic(), generateTopic()]);
    });

    expect(result.current).toBeNull();
  });
});

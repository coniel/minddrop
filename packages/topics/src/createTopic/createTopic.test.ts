import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { Topic } from '../types';
import { createTopic } from './createTopic';
import { useAllTopics } from '../useAllTopics';

let core = initializeCore('topics');

describe('createTopic', () => {
  afterEach(() => {
    core = initializeCore('topics');
  });

  it('creates a topic', () => {
    const topic = createTopic(core);

    expect(topic).toBeDefined();
    expect(topic.title).toBe('');
  });

  it('sets passed in data', () => {
    const topic = createTopic(core, { title: 'My topic' });
    expect(topic.title).toBe('My topic');
  });

  it('adds topic to the store', () => {
    const { result } = renderHook(() => useAllTopics());
    let topic: Topic;

    act(() => {
      topic = createTopic(core, { title: 'My topic' });
    });

    expect(result.current[topic.id]).toEqual(topic);
  });

  it("dispatches a 'topics:create' event", (done) => {
    let topic: Topic;

    function callback(payload) {
      expect(payload.data).toEqual(topic);
      done();
    }

    core.addEventListener('topics:create', callback);

    topic = createTopic(core, { title: 'My topic' });
  });
});

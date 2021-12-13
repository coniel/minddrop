import { act, renderHook, MockDate } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { updateTopic } from './updateTopic';
import { useTopicsStore } from '../useTopicsStore';
import { useAllTopics } from '../useAllTopics';
import { createTopic } from '../createTopic';
import { Topic } from '../types';

let core = initializeCore('topics');

describe('updateTopic', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTopicsStore());

    act(() => {
      result.current.clear();
    });

    core = initializeCore('topics');
  });

  it('updates the topic', () => {
    const { result } = renderHook(() => useAllTopics());
    let topic: Topic;

    act(() => {
      topic = createTopic(core, {});
      updateTopic(core, topic.id, { title: 'My topic' });
    });

    expect(result.current[topic.id].title).toBe('My topic');
  });

  it('returns the updated topic', () => {
    MockDate.set('01/01/2000');
    const changes = { title: 'My topic' };
    let topic: Topic;

    act(() => {
      topic = createTopic(core);

      MockDate.set('01/02/2000');

      topic = updateTopic(core, topic.id, changes);
    });

    expect(topic.title).toBe('My topic');
    // Updates the updatedAt timestamp
    expect(topic.updatedAt.getTime()).toBe(new Date('01/02/2000').getTime());

    MockDate.reset();
  });

  it("dispatches a 'topics:update' event", (done) => {
    MockDate.set('01/01/2000');
    const changes = { title: 'My topic' };
    let topic: Topic;

    function callback(payload) {
      expect(payload.data).toEqual({
        before: topic,
        after: { ...topic, ...changes, updatedAt: new Date('01/02/2000') },
        changes: { ...changes, updatedAt: new Date('01/02/2000') },
      });
      done();
    }

    core.addEventListener('topics:update', callback);

    act(() => {
      topic = createTopic(core, {});
      MockDate.set('01/02/2000');
      updateTopic(core, topic.id, changes);
      MockDate.reset();
    });
  });
});

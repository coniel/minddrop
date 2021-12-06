import { act, renderHook, MockDate } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { generateTopic } from '../generateTopic';
import { updateTopic } from './updateTopic';
import { useTopicsStore } from '../useTopicsStore';

let core = initializeCore('topics');

describe('updateTopic', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTopicsStore());

    act(() => {
      result.current.clear();
    });

    core = initializeCore('topics');
  });

  it('returns the updated topic', () => {
    MockDate.set('01/01/2000');
    const { result } = renderHook(() => useTopicsStore());
    const changes = { title: 'My topic' };
    const topic = generateTopic();

    act(() => {
      result.current.addTopic(topic);
    });

    MockDate.set('01/02/2000');

    const updated = updateTopic(core, topic.id, changes);

    expect(updated.title).toBe('My topic');
    // Updates the updatedAt timestamp
    expect(updated.updatedAt.getTime()).toBe(new Date('01/02/2000').getTime());

    MockDate.reset();
  });

  it("dispatches a 'topics:update' event", () => {
    MockDate.set('01/01/2000');
    const { result } = renderHook(() => useTopicsStore());
    const callback = jest.fn();
    const changes = { title: 'My topic' };
    const topic = generateTopic();

    act(() => {
      result.current.addTopic(topic);
    });

    core.addEventListener('topics:update', callback);

    MockDate.set('01/02/2000');

    updateTopic(core, topic.id, changes);

    expect(callback).toHaveBeenCalledWith({
      source: 'topics',
      type: 'topics:update',
      data: {
        before: topic,
        after: { ...topic, ...changes, updatedAt: new Date('01/02/2000') },
        changes: { ...changes, updatedAt: new Date('01/02/2000') },
      },
    });

    MockDate.reset();
  });
});

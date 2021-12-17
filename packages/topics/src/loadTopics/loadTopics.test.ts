import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { loadTopics } from './loadTopics';
import { generateTopic } from '../generateTopic';
import { useAllTopics } from '../useAllTopics';
import { useTopicsStore } from '../useTopicsStore';

let core = initializeCore({ appId: 'app-id', extensionId: 'topics' });

describe('loadTopics', () => {
  afterEach(() => {
    act(() => {
      useTopicsStore.getState().clear();
    });
    core = initializeCore({ appId: 'app-id', extensionId: 'topics' });
  });

  it('loads topics into the store', () => {
    const { result } = renderHook(() => useAllTopics());
    const topic1 = generateTopic();
    const topic2 = generateTopic();

    act(() => {
      loadTopics(core, [topic1, topic2]);
    });

    expect(result.current[topic1.id]).toBeDefined();
    expect(result.current[topic2.id]).toBeDefined();
  });

  it("dispatches a 'topics:load' event", (done) => {
    const topic1 = generateTopic();
    const topic2 = generateTopic();
    const topics = [topic1, topic2];

    function callback(payload) {
      expect(payload.data).toEqual(topics);
      done();
    }

    core.addEventListener('topics:load', callback);

    loadTopics(core, topics);
  });
});

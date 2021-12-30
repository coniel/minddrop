import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { generateTopic } from '../generateTopic';
import { useAllTopics } from '../useAllTopics';
import { clearTopics } from './clearTopics';
import { loadTopics } from '../loadTopics';

let core = initializeCore({ appId: 'app-id', extensionId: 'topics' });

describe('clearTopics', () => {
  afterEach(() => {
    core = initializeCore({ appId: 'app-id', extensionId: 'topics' });
  });

  it('clears topics from the store', () => {
    const { result } = renderHook(() => useAllTopics());
    const topic1 = generateTopic();
    const topic2 = generateTopic();

    act(() => {
      loadTopics(core, [topic1, topic2]);
      clearTopics(core);
    });

    expect(result.current[topic1.id]).not.toBeDefined();
    expect(result.current[topic2.id]).not.toBeDefined();
  });

  it("dispatches a 'topics:clear' event", (done) => {
    function callback() {
      done();
    }

    core.addEventListener('topics:clear', callback);

    clearTopics(core);
  });
});

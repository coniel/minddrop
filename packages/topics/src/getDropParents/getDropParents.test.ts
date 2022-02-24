import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onRun, onDisable } from '../topics-extension';
import { generateTopic } from '../generateTopic';
import { getDropParents } from './getDropParents';
import { loadTopics } from '../loadTopics';
import { deleteTopic } from '../deleteTopic';

let core = initializeCore({ appId: 'app-id', extensionId: 'topics' });

// Run topics extension
onRun(core);

describe('getDropParents', () => {
  afterEach(() => {
    core = initializeCore({ appId: 'app-id', extensionId: 'topics' });
    act(() => {
      onDisable(core);
      onRun(core);
    });
  });

  it("gets a drop's parent topics", () => {
    const topic1 = generateTopic({ drops: ['drop-id'] });
    const topic2 = generateTopic({ drops: ['drop-id'] });

    act(() => {
      loadTopics(core, [topic1, topic2]);
    });

    const parents = getDropParents('drop-id');

    expect(Object.keys(parents).length).toBe(2);
    expect(parents[topic1.id]).toEqual(topic1);
    expect(parents[topic2.id]).toEqual(topic2);
  });

  it('filters results', () => {
    const topic1 = generateTopic({ drops: ['drop-id'] });
    const topic2 = generateTopic({ drops: ['drop-id'] });

    act(() => {
      loadTopics(core, [topic1, topic2]);
      deleteTopic(core, topic2.id);
    });

    const parents = getDropParents('drop-id', { deleted: true });

    expect(Object.keys(parents).length).toBe(1);
    expect(parents[topic1.id]).not.toBeDefined();
    expect(parents[topic2.id]).toBeDefined();
  });
});

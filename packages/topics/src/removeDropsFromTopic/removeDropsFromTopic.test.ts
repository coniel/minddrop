import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Drops,
  onRun as onRunDrops,
  onDisable as onDisableDrops,
  Drop,
} from '@minddrop/drops';
import { onRun, onDisable } from '../topics-extension';
import { removeDropsFromTopic } from './removeDropsFromTopic';
import { Topic } from '../types';
import { createTopic } from '../createTopic';
import { addDropsToTopic } from '../addDropsToTopic';

let core = initializeCore('topics');

// Run drops extension
onRunDrops(core);
// Run topics extension
onRun(core);

describe('removeDropsFromTopic', () => {
  afterEach(() => {
    core = initializeCore('topics');
    act(() => {
      onDisableDrops(core);
      onDisable(core);
      onRunDrops(core);
      onRun(core);
    });
  });

  it('removes drops from the topic', async () => {
    let topic: Topic;
    let drop1: Drop;
    let drop2: Drop;

    await act(async () => {
      drop1 = await Drops.create(core, { type: 'text' });
      drop2 = await Drops.create(core, { type: 'text' });
      topic = createTopic(core);
      topic = addDropsToTopic(core, topic.id, [drop1.id, drop2.id]);
      topic = removeDropsFromTopic(core, topic.id, [drop1.id]);
    });

    expect(topic.drops).toBeDefined();
    expect(topic.drops.length).toBe(1);
    expect(topic.drops[0]).toBe(drop2.id);
  });

  it("dispatches a 'topics:remove-drops' event", (done) => {
    let topic: Topic;
    let drop: Drop;

    function callback(payload) {
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.drops).toEqual({ [drop.id]: drop });
      done();
    }

    core.addEventListener('topics:remove-drops', callback);

    act(() => {
      drop = Drops.create(core, { type: 'text' });
      topic = createTopic(core);
      topic = addDropsToTopic(core, topic.id, [drop.id]);
      topic = removeDropsFromTopic(core, topic.id, [drop.id]);
    });
  });
});

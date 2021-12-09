import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Drops,
  onRun as onRunDrops,
  onDisable as onDisableDrops,
  Drop,
} from '@minddrop/drops';
import { onRun, onDisable } from '../extension';
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
    let dropRef1: Drop;
    let dropRef2: Drop;

    await act(async () => {
      dropRef1 = await Drops.create(core, { type: 'text' });
      dropRef2 = await Drops.create(core, { type: 'text' });
      topic = createTopic(core);
      topic = addDropsToTopic(core, topic.id, [dropRef1.id, dropRef2.id]);
      topic = removeDropsFromTopic(core, topic.id, [dropRef1.id]);
    });

    expect(topic.drops).toBeDefined();
    expect(topic.drops.length).toBe(1);
    expect(topic.drops[0]).toBe(dropRef2.id);
  });

  it("dispatches a 'topics:remove-drops' event", async () => {
    const callback = jest.fn();
    let topic: Topic;
    let dropRef: Drop;

    core.addEventListener('topics:remove-drops', callback);

    await act(async () => {
      dropRef = await Drops.create(core, { type: 'text' });
      topic = createTopic(core);
      topic = addDropsToTopic(core, topic.id, [dropRef.id]);
      topic = removeDropsFromTopic(core, topic.id, [dropRef.id]);
    });

    expect(callback).toHaveBeenCalledWith({
      source: 'topics',
      type: 'topics:remove-drops',
      data: { topic, drops: { [dropRef.id]: dropRef } },
    });
  });
});

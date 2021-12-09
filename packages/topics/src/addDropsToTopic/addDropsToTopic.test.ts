import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Drops,
  onRun as onRunDrops,
  onDisable as onDisableDrops,
  Drop,
  DropNotFoundError,
} from '@minddrop/drops';
import { onRun, onDisable } from '../topics-extension';
import { addDropsToTopic } from './addDropsToTopic';
import { Topic } from '../types';
import { createTopic } from '../createTopic';

let core = initializeCore('topics');

// Run drops extension
onRunDrops(core);
// Run topics extension
onRun(core);

describe('addDropsToTopic', () => {
  afterEach(() => {
    core = initializeCore('topics');
    act(() => {
      onDisableDrops(core);
      onDisable(core);
      onRunDrops(core);
      onRun(core);
    });
  });

  it('adds drops to the topic', async () => {
    let topic: Topic;
    let dropRef: Drop;

    await act(async () => {
      dropRef = await Drops.create(core, { type: 'text' });
      topic = createTopic(core);
      topic = addDropsToTopic(core, topic.id, [dropRef.id]);
    });

    expect(topic.drops).toBeDefined();
    expect(topic.drops.length).toBe(1);
    expect(topic.drops[0]).toBe(dropRef.id);
  });

  it('throws if drop attachement does not exist', async () => {
    let topic: Topic;

    await act(async () => {
      topic = createTopic(core);
    });
    expect(() =>
      addDropsToTopic(core, topic.id, ['missing-drop-id']),
    ).toThrowError(DropNotFoundError);
  });

  it("dispatches a 'topics:add-drops' event", async () => {
    const callback = jest.fn();
    let topic: Topic;
    let dropRef: Drop;

    core.addEventListener('topics:add-drops', callback);

    await act(async () => {
      dropRef = await Drops.create(core, { type: 'text' });
      topic = createTopic(core);
      topic = addDropsToTopic(core, topic.id, [dropRef.id]);
    });

    expect(callback).toHaveBeenCalledWith({
      source: 'topics',
      type: 'topics:add-drops',
      data: { topic, drops: { [dropRef.id]: dropRef } },
    });
  });
});

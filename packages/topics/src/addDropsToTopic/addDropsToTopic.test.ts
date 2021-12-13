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
    let drop: Drop;

    await act(async () => {
      drop = await Drops.create(core, { type: 'text' });
      topic = createTopic(core);
      topic = addDropsToTopic(core, topic.id, [drop.id]);
    });

    expect(topic.drops).toBeDefined();
    expect(topic.drops.length).toBe(1);
    expect(topic.drops[0]).toBe(drop.id);
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

  it("dispatches a 'topics:add-drops' event", (done) => {
    let topic: Topic;
    let drop: Drop;

    function callback(payload) {
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.drops).toEqual({ [drop.id]: drop });
      done();
    }

    core.addEventListener('topics:add-drops', callback);

    act(() => {
      drop = Drops.create(core, { type: 'text' });
      topic = createTopic(core);
      topic = addDropsToTopic(core, topic.id, [drop.id]);
    });
  });
});

import { act } from '@minddrop/test-utils';
import {
  Drops,
  onRun as onRunDrops,
  onDisable as onDisableDrops,
  Drop,
  DROPS_TEST_DATA,
} from '@minddrop/drops';
import { onRun, onDisable } from '../topics-extension';
import { removeDropsFromTopic } from './removeDropsFromTopic';
import { Topic } from '../types';
import { createTopic } from '../createTopic';
import { addDropsToTopic } from '../addDropsToTopic';
import {
  cleanup,
  core,
  setup,
  topicViewColumnsConfig,
  topicViewWithoutCallbacks,
  tSailing,
} from '../test-utils';
import { registerTopicView } from '../registerTopicView';
import { createTopicViewInstance } from '../createTopicViewInstance';

const viewConfig = {
  ...topicViewColumnsConfig,
  id: 'on-create-view-test',
  onRemoveDrops: jest.fn(),
};

describe('removeDropsFromTopic', () => {
  beforeEach(() => {
    setup();
    onRunDrops(core);
    onRun(core);
    Drops.register(core, DROPS_TEST_DATA.textDropConfig);
  });

  afterEach(() => {
    cleanup();
    act(() => {
      onDisableDrops(core);
      onDisable(core);
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

  it("calls topic view's onRemoveDrops for each view instance", async () => {
    const drop = await Drops.create(core, { type: 'text' });
    registerTopicView(core, viewConfig);

    const instance1 = createTopicViewInstance(core, tSailing.id, viewConfig.id);
    createTopicViewInstance(core, tSailing.id, topicViewWithoutCallbacks.id);

    removeDropsFromTopic(core, tSailing.id, [drop.id]);

    expect(viewConfig.onRemoveDrops).toHaveBeenCalledWith(core, instance1, {
      [drop.id]: drop,
    });
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

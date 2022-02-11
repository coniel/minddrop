import {
  Drops,
  onRun as onRunDrops,
  onDisable as onDisableDrops,
  Drop,
  DropNotFoundError,
  DROPS_TEST_DATA,
} from '@minddrop/drops';
import { onRun, onDisable } from '../topics-extension';
import { createTopicViewInstance } from '../createTopicViewInstance';
import {
  cleanup,
  core,
  setup,
  topicViewColumnsConfig,
  topicViewWithoutCallbacks,
  tSailing,
} from '../test-utils';
import { getTopic } from '../getTopic';
import { addDropsToTopic } from './addDropsToTopic';
import { registerTopicView } from '../registerTopicView';

const viewConfig = {
  ...topicViewColumnsConfig,
  id: 'on-create-view-test',
  onAddDrops: jest.fn(),
};

describe('addDropsToTopic', () => {
  beforeEach(() => {
    setup();
    onRunDrops(core);
    onRun(core);
    Drops.register(core, DROPS_TEST_DATA.textDropConfig);
  });

  afterEach(() => {
    cleanup();
    onDisableDrops(core);
    onDisable(core);
  });

  it('adds drops to the topic', async () => {
    const drop = await Drops.create(core, { type: 'text' });
    addDropsToTopic(core, tSailing.id, [drop.id]);

    const topic = getTopic(tSailing.id);

    expect(topic.drops).toBeDefined();
    expect(topic.drops.includes(drop.id)).toBeTruthy();
  });

  it('throws if drop does not exist', async () => {
    expect(() =>
      addDropsToTopic(core, tSailing.id, ['missing-drop-id']),
    ).toThrowError(DropNotFoundError);
  });

  it("calls topic view's onAddDrops for each view instance", async () => {
    const drop = await Drops.create(core, { type: 'text' });
    registerTopicView(core, viewConfig);

    const instance1 = createTopicViewInstance(core, tSailing.id, viewConfig.id);
    createTopicViewInstance(core, tSailing.id, topicViewWithoutCallbacks.id);

    const metadata = {
      viewInstance: instance1.id,
      column: 2,
    };

    addDropsToTopic(core, tSailing.id, [drop.id], metadata);

    expect(viewConfig.onAddDrops).toHaveBeenCalledWith(
      core,
      instance1,
      { [drop.id]: drop },
      metadata,
    );
  });

  it("dispatches a 'topics:add-drops' event", (done) => {
    let drop: Drop;

    function callback(payload) {
      const topic = getTopic(tSailing.id);
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.drops).toEqual({ [drop.id]: drop });
      done();
    }

    core.addEventListener('topics:add-drops', callback);

    drop = Drops.create(core, { type: 'text' });
    addDropsToTopic(core, tSailing.id, [drop.id]);
  });
});

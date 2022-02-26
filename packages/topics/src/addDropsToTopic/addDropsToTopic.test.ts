import { Drops, DropNotFoundError, DROPS_TEST_DATA } from '@minddrop/drops';
import { createTopicViewInstance } from '../createTopicViewInstance';
import {
  cleanup,
  core,
  setup,
  topicViewColumnsConfig,
  topicViewWithoutCallbacks,
  tNoDrops,
  tSixDrops,
} from '../test-utils';
import { getTopic } from '../getTopic';
import { addDropsToTopic } from './addDropsToTopic';
import { registerTopicView } from '../registerTopicView';
import { contains } from '@minddrop/utils';

const { textDrop1, textDropConfig } = DROPS_TEST_DATA;

describe('addDropsToTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds drops to the topic', () => {
    // Add drop to the topic
    addDropsToTopic(core, tNoDrops.id, [textDrop1.id]);

    // Get the updated topic
    const topic = getTopic(tNoDrops.id);

    // Topic's drops should contain drop ID
    expect(topic.drops.includes(textDrop1.id)).toBeTruthy();
  });

  it("adds topic to the drop's parents", () => {
    // Add the drop to the topic
    addDropsToTopic(core, tNoDrops.id, [textDrop1.id]);

    // Get the updated drop
    const drop = Drops.get(textDrop1.id);

    // Should have added topic ID to drop's parents
    expect(
      contains(drop.parents, [{ type: 'topic', id: tNoDrops.id }]),
    ).toBeTruthy();
  });

  it('throws if drop does not exist', async () => {
    expect(() =>
      addDropsToTopic(core, tNoDrops.id, ['missing-drop-id']),
    ).toThrowError(DropNotFoundError);
  });

  it("calls topic view's onAddDrops for each view instance", () => {
    // Register test topic view config
    const viewConfig = {
      ...topicViewColumnsConfig,
      id: 'on-create-view-test',
      onAddDrops: jest.fn(),
    };
    registerTopicView(core, viewConfig);

    // Create an instance of the test topic view
    const instance = createTopicViewInstance(core, tNoDrops.id, viewConfig.id);
    // Create an instance of a topic view with no onAddDrops callback
    createTopicViewInstance(core, tNoDrops.id, topicViewWithoutCallbacks.id);

    // Add metadata to the call
    const metadata = {
      viewInstance: instance.id,
      column: 2,
    };

    // Add drop to the topic
    addDropsToTopic(core, tNoDrops.id, [textDrop1.id], metadata);

    // Get updated drop
    const drop = Drops.get(textDrop1.id);

    // Should be called on the view instance with appropriate data and metadata
    expect(viewConfig.onAddDrops).toHaveBeenCalledWith(
      core,
      instance,
      { [drop.id]: drop },
      metadata,
    );
  });

  it("dispatches a 'topics:add-drops' event", (done) => {
    function callback(payload) {
      // Get the updated topic
      const topic = getTopic(tNoDrops.id);
      // Get the updated drop
      const drop = Drops.get(textDrop1.id);

      // Payload data should contain updated topic
      expect(payload.data.topic).toEqual(topic);
      // Payload data should contain updated drop
      expect(payload.data.drops).toEqual({ [drop.id]: drop });
      done();
    }

    // Listen to 'topics:add-drops' event
    core.addEventListener('topics:add-drops', callback);

    // Add drop to the topic
    addDropsToTopic(core, tNoDrops.id, [textDrop1.id]);
  });

  it('does not add drops already in the topic', () => {
    // Create a new drop to add
    const newDrop = Drops.create(core, { type: textDropConfig.type });
    // Add new and existing drop (already in topic) to the topic
    addDropsToTopic(core, tSixDrops.id, [textDrop1.id, newDrop.id]);

    // Get the updated topic
    const topic = getTopic(tSixDrops.id);

    // Shoould have addded only 1 drop
    expect(topic.drops.length).toBe(7);
  });

  it('does nothing if there are no drops to add', () => {
    jest.spyOn(core, 'dispatch');

    // Add drop which is already in the topic
    addDropsToTopic(core, tSixDrops.id, [textDrop1.id]);

    // Should not end up dispatching anything
    expect(core.dispatch).not.toHaveBeenCalled();
  });
});

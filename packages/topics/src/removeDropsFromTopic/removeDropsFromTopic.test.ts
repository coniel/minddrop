import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { removeDropsFromTopic } from './removeDropsFromTopic';
import {
  cleanup,
  core,
  setup,
  topicViewColumnsConfig,
  topicViewWithoutCallbacks,
  tSixDrops,
} from '../test-utils';
import { registerTopicView } from '../registerTopicView';
import { createTopicViewInstance } from '../createTopicViewInstance';
import { getTopic } from '../getTopic';
import { addDropsToTopic } from '../addDropsToTopic';

const { textDrop1, textDropConfig } = DROPS_TEST_DATA;

describe('removeDropsFromTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes drops from the topic', () => {
    // Remove drop from topic
    removeDropsFromTopic(core, tSixDrops.id, [textDrop1.id]);

    // Get the updated topic
    const topic = getTopic(tSixDrops.id);

    // Should have removed drop ID from topic's drops
    expect(topic.drops.includes(textDrop1.id)).toBeFalsy();
  });

  it('returns the updated topic', () => {
    // Remove drop from topic
    const result = removeDropsFromTopic(core, tSixDrops.id, [textDrop1.id]);

    // Get the updated topic
    const topic = getTopic(tSixDrops.id);

    // Returned topic should match updated topic
    expect(result).toEqual(topic);
  });

  it('removes the topic as a parent of the drops', () => {
    // Create a new drop
    let drop = Drops.create(core, { type: textDropConfig.type });

    // Add new drop to topic
    addDropsToTopic(core, tSixDrops.id, [drop.id]);

    // Remove drop from topic
    removeDropsFromTopic(core, tSixDrops.id, [drop.id]);

    // Get updated drop
    drop = Drops.get(drop.id);

    // Drop should no longer have topic as a parent
    expect(drop.parents.includes(tSixDrops.id)).toBeFalsy();
  });

  it('does not remove the topic as a parent if the drop is deleted', () => {
    // Create a new drop
    let drop = Drops.create(core, { type: textDropConfig.type });

    // Add new drop to topic
    addDropsToTopic(core, tSixDrops.id, [drop.id]);

    // Delete the drop
    Drops.delete(core, drop.id);

    // Remove drop from topic
    removeDropsFromTopic(core, tSixDrops.id, [drop.id]);

    // Get updated drop
    drop = Drops.get(drop.id);

    // Drop should still have topic as a parent
    expect(drop.parents.includes(tSixDrops.id)).toBeTruthy();
  });

  it("calls topic view's onRemoveDrops for each view instance", () => {
    // Register test topic view
    const viewConfig = {
      ...topicViewColumnsConfig,
      id: 'on-create-view-test',
      onRemoveDrops: jest.fn(),
    };
    registerTopicView(core, viewConfig);

    // Create an instance of the test topic view
    const instance = createTopicViewInstance(core, tSixDrops.id, viewConfig.id);
    // Create an instance of a topic view with no onRemoveDrops callback
    createTopicViewInstance(core, tSixDrops.id, topicViewWithoutCallbacks.id);

    // Remove drop from topic
    removeDropsFromTopic(core, tSixDrops.id, [textDrop1.id]);

    // Get the updated drop
    const drop = Drops.get(textDrop1.id);

    // Should call the test topic view's onRemoveDrops callback with appropriate data
    expect(viewConfig.onRemoveDrops).toHaveBeenCalledWith(core, instance, {
      [drop.id]: drop,
    });
  });

  it("dispatches a 'topics:remove-drops' event", (done) => {
    // Listen to 'topics:remove-drops' event
    core.addEventListener('topics:remove-drops', (payload) => {
      // Get the updated topic
      const topic = getTopic(tSixDrops.id);
      // Get the updated drop
      const drop = Drops.get(textDrop1.id);

      // Payload data should include updated topic
      expect(payload.data.topic).toEqual(topic);
      // Payload data should include updated drops
      expect(payload.data.drops).toEqual({ [drop.id]: drop });
      done();
    });

    // Remove drop from topic
    removeDropsFromTopic(core, tSixDrops.id, [textDrop1.id]);
  });
});

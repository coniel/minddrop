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

const { textDrop1 } = DROPS_TEST_DATA;

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

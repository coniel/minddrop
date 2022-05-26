import { Drops } from '@minddrop/drops';
import {
  setup,
  cleanup,
  core,
  tSixDrops,
  topicViewColumnsConfig,
  topicViewWithoutCallbacks,
} from '../test-utils';
import { registerTopicView } from '../registerTopicView';
import { archiveDropsInTopic } from './archiveDropsInTopic';
import { createTopicViewInstance } from '../createTopicViewInstance';
import { TopicsResource } from '../TopicsResource';

describe('archiveDropsInTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('archives the drops on the topic', () => {
    const dropIds = tSixDrops.drops.slice(0, 2);

    // Archive the drops
    archiveDropsInTopic(core, tSixDrops.id, dropIds);

    // Get updated topic
    const topic = TopicsResource.get(tSixDrops.id);
    // Should add drop IDs to 'archviedDrops'
    expect(topic.archivedDrops.includes(dropIds[0])).toBeTruthy();
    expect(topic.archivedDrops.includes(dropIds[1])).toBeTruthy();
    // Should remove drop IDs from 'drops'
    expect(topic.drops.includes(dropIds[0])).toBeFalsy();
    expect(topic.drops.includes(dropIds[1])).toBeFalsy();
  });

  it('returns the updated topic', () => {
    const dropIds = tSixDrops.drops.slice(0, 2);

    // Archive the drops
    const result = archiveDropsInTopic(core, tSixDrops.id, dropIds);

    // Should return updated topic
    expect(result).toEqual(TopicsResource.get(tSixDrops.id));
  });

  it('dispatches a `topics:topic:archive-drops` event', (done) => {
    const dropIds = tSixDrops.drops.slice(0, 2);

    core.addEventListener('topics:topic:archive-drops', (payload) => {
      // Get the updated topic
      const topic = TopicsResource.get(tSixDrops.id);
      // Get the archived drops
      const drops = Drops.get(dropIds);

      // Payload should contain topic and drops
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.drops).toEqual(drops);
      done();
    });

    // Arhive the drops
    archiveDropsInTopic(core, tSixDrops.id, dropIds);
  });

  it("calls onRemoveDrops on the topic's view instances", () => {
    const viewConfig = {
      ...topicViewColumnsConfig,
      id: 'on-create-view-test',
      onRemoveDrops: jest.fn(),
    };

    // Register test topic view
    registerTopicView(core, viewConfig);

    // Archive 2 first drops in topic
    const dropIds = tSixDrops.drops.slice(0, 2);

    // Get the drops
    const drops = Drops.get(dropIds);

    // Create an instance of test topic view
    const instance = createTopicViewInstance(core, tSixDrops.id, viewConfig.id);
    // Create an instance of a topic view with no onRemoveDrops callback
    createTopicViewInstance(core, tSixDrops.id, topicViewWithoutCallbacks.id);

    // Archive the drops
    archiveDropsInTopic(core, tSixDrops.id, dropIds);

    // Should call onRemoveDrops on the view instance
    expect(viewConfig.onRemoveDrops).toHaveBeenCalledWith(
      core,
      instance,
      drops,
    );
  });
});

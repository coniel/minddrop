import { Drops } from '@minddrop/drops';
import {
  setup,
  cleanup,
  core,
  tTwoDrops,
  tEmpty,
  topicViewColumnsConfig,
} from '../test-utils';
import { moveDropsToTopic } from './moveDropsToTopic';
import { TopicsResource } from '../TopicsResource';
import { registerTopicView } from '../registerTopicView';

describe('moveDropsToTopic', () => {
  beforeEach(() => {
    setup();

    // Register test topic view
    registerTopicView(core, topicViewColumnsConfig);
  });

  afterEach(cleanup);

  it('adds the drops to the destination topic', () => {
    // Move the drops
    moveDropsToTopic(core, tTwoDrops.id, tEmpty.id, tTwoDrops.drops);

    // Get the updated target parent topic
    const topic = TopicsResource.get(tEmpty.id);

    // Should contain the subtopics
    expect(topic.drops).toEqual(tTwoDrops.drops);
  });

  it('removes drops from the source topic', () => {
    // Move the drops
    moveDropsToTopic(core, tTwoDrops.id, tEmpty.id, tTwoDrops.drops);

    // Get the updated source parent topic
    const topic = TopicsResource.get(tTwoDrops.id);

    // Shold no longer contain the subtopics
    expect(topic.drops.length).toBe(0);
  });

  it('dispatches a `topics:topic:move-drops` event', (done) => {
    // Listen to 'topics:topic:move-drops' events
    core.addEventListener('topics:topic:move-drops', (payload) => {
      // Get the updated source topic
      const fromTopic = TopicsResource.get(tTwoDrops.id);
      // Get the updated target parent topic
      const toTopic = TopicsResource.get(tEmpty.id);
      // Get the updated drops
      const drops = Drops.get(tTwoDrops.drops);

      // Payload data should include updated source topic as 'fromTopic'
      expect(payload.data.fromTopic).toEqual(fromTopic);
      // Payload data should include updated target topic as 'toTopic'
      expect(payload.data.toTopic).toEqual(toTopic);
      // Payload data should include updated drops as 'drops'
      expect(payload.data.drops).toEqual(drops);
      done();
    });

    // Move the drops
    moveDropsToTopic(core, tTwoDrops.id, tEmpty.id, tTwoDrops.drops);
  });
});

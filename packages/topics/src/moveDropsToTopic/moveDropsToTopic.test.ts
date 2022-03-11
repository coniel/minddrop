import { Drops } from '@minddrop/drops';
import { getTopic } from '../getTopic';
import { setup, cleanup, core, tTwoDrops, tEmpty } from '../test-utils';
import { moveDropsToTopic } from './moveDropsToTopic';

describe('moveDropsToTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the drops to the destination topic', () => {
    // Move the drops
    moveDropsToTopic(core, tTwoDrops.id, tEmpty.id, tTwoDrops.drops);

    // Get the updated target parent topic
    const topic = getTopic(tEmpty.id);

    // Should contain the subtopics
    expect(topic.drops).toEqual(tTwoDrops.drops);
  });

  it('removes drops from the source topic', () => {
    // Move the drops
    moveDropsToTopic(core, tTwoDrops.id, tEmpty.id, tTwoDrops.drops);

    // Get the updated source parent topic
    const topic = getTopic(tTwoDrops.id);

    // Shold no longer contain the subtopics
    expect(topic.drops.length).toBe(0);
  });

  it('dispatches a `topics:move-drops` event', (done) => {
    // Listen to 'topics:move-drops' events
    core.addEventListener('topics:move-drops', (payload) => {
      // Get the updated source topic
      const fromTopic = getTopic(tTwoDrops.id);
      // Get the updated target parent topic
      const toTopic = getTopic(tEmpty.id);
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

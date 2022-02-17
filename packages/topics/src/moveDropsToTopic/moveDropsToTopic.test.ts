import { getTopic } from '../getTopic';
import { setup, cleanup, core, tTwoDrops, tEmpty } from '../test-utils';
import { moveDropsToTopic } from './moveDropsToTopic';

describe('moveDropsToTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the drops to the destination topic', () => {
    moveDropsToTopic(core, tTwoDrops.id, tEmpty.id, tTwoDrops.drops);

    const topic = getTopic(tEmpty.id);

    expect(topic.drops).toEqual(tTwoDrops.drops);
  });

  it('removes drops from the source topic', () => {
    moveDropsToTopic(core, tTwoDrops.id, tEmpty.id, tTwoDrops.drops);

    const topic = getTopic(tTwoDrops.id);

    expect(topic.drops.length).toBe(0);
  });
});

import { Drops } from '@minddrop/drops';
import { getTopic } from '../getTopic';
import { setup, cleanup, core, tSixDrops } from '../test-utils';
import { archiveDropsInTopic } from './archiveDropsInTopic';

describe('archiveDropsInTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('archives the drops on the topic', () => {
    const dropIds = tSixDrops.drops.slice(0, 2);

    // Archive the drops
    archiveDropsInTopic(core, tSixDrops.id, dropIds);

    // Get updated topic
    const topic = getTopic(tSixDrops.id);
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
    expect(result).toEqual(getTopic(tSixDrops.id));
  });

  it('dispatches a `topics:archive-drops` event', (done) => {
    const dropIds = tSixDrops.drops.slice(0, 2);

    core.addEventListener('topics:archive-drops', (payload) => {
      // Get the updated topic
      const topic = getTopic(tSixDrops.id);
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
});

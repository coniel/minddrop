import { Drops } from '@minddrop/drops';
import { archiveDropsInTopic } from '../archiveDropsInTopic';
import {
  setup,
  cleanup,
  core,
  tSixDrops,
  topicViewColumnsConfig,
} from '../test-utils';
import { TopicsResource } from '../TopicsResource';
import { registerTopicView } from '../registerTopicView';
import { unarchiveDropsInTopic } from './unarchiveDropsInTopic';

const dropIds = tSixDrops.drops.slice(0, 2);

describe('unarchiveDropsInTopic', () => {
  beforeEach(() => {
    setup();

    // Register a test topic view
    registerTopicView(core, topicViewColumnsConfig);

    // Archive the test drops
    archiveDropsInTopic(core, tSixDrops.id, dropIds);
  });

  afterEach(cleanup);

  it('unarchives the drops on the topic', () => {
    // Unarchive the drops
    unarchiveDropsInTopic(core, tSixDrops.id, dropIds);

    // Get updated topic
    const topic = TopicsResource.get(tSixDrops.id);
    // Should add drop IDs to 'drops'
    expect(topic.drops.includes(dropIds[0])).toBeTruthy();
    expect(topic.drops.includes(dropIds[1])).toBeTruthy();
    // Should remove drop IDs from 'archivedDrops'
    expect(topic.archivedDrops.includes(dropIds[0])).toBeFalsy();
    expect(topic.archivedDrops.includes(dropIds[1])).toBeFalsy();
  });

  it('returns the updated topic', () => {
    // Unarchive the drops
    const result = unarchiveDropsInTopic(core, tSixDrops.id, dropIds);

    // Should return updated topic
    expect(result).toEqual(TopicsResource.get(tSixDrops.id));
  });

  it('dispatches a `topics:topic:unarchive-drops` event', (done) => {
    // Listen to 'topics:topic:unarchive-drops' events
    core.addEventListener('topics:topic:unarchive-drops', (payload) => {
      // Get the updated topic
      const topic = TopicsResource.get(tSixDrops.id);
      // Get the unarchived drops
      const drops = Drops.get(dropIds);

      // Payload should contain topic and drops
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.drops).toEqual(drops);
      done();
    });

    // Arhive the drops
    unarchiveDropsInTopic(core, tSixDrops.id, dropIds);
  });
});

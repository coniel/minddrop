import { deleteTopicPermanently } from './deleteTopicPermanently';
import { getTopic } from '../getTopic';
import { TopicNotFoundError } from '../errors';
import { Drops } from '@minddrop/drops';
import { addDropsToTopic } from '../addDropsToTopic';
import { setup, cleanup, core } from '../test-utils';
import { tNoDrops, tSailing } from '../test-utils/topics.data';

describe('deleteTopicPermanently', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the deleted topic', () => {
    // Permanently delete the topic
    const deletedTopic = deleteTopicPermanently(core, tSailing.id);

    // Should return the deleted topic
    expect(deletedTopic).toEqual(tSailing);
  });

  it('removes topic from the store', () => {
    // Permanently delete the topic
    deleteTopicPermanently(core, tSailing.id);

    // Should throw TopicNotFoundError when attempting to get it
    expect(() => getTopic(tSailing.id)).toThrowError(TopicNotFoundError);
  });

  it('removes the topic as a parent from its drops', () => {
    // Create a drop
    let drop = Drops.create(core, { type: 'text' });

    // Add drop to topic
    addDropsToTopic(core, tNoDrops.id, [drop.id]);

    // Permanently delete the topic
    deleteTopicPermanently(core, tNoDrops.id);

    // Get the updated drop
    drop = Drops.get(drop.id);

    // Drop should not have topic as parent
    expect(drop.parents.length).toBe(0);
  });

  it("dispatches a 'topics:delete-permanently' event", (done) => {
    // Listen to 'topics:delete-permanently' events
    core.addEventListener('topics:delete-permanently', (payload) => {
      // Payload data should be the deleted topic
      expect(payload.data).toEqual(tSailing);
      done();
    });

    // Permanently delete the topic
    deleteTopicPermanently(core, tSailing.id);
  });
});

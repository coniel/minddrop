import { doesNotContain } from '@minddrop/utils';
import { Topic } from '../types';
import { getTopic } from '../getTopic';
import { setup, cleanup, core, tNoDrops } from '../test-utils';
import { removeParentsFromTopic } from './removeParentsFromTopic';
import { addParentsToTopic } from '../addParentsToTopic/addParentsToTopic';

describe('removeParentsToTopic', () => {
  beforeEach(() => {
    setup();

    // Add three parents to the topic
    addParentsToTopic(core, tNoDrops.id, [
      { type: 'topic', id: 'parent-1' },
      { type: 'topic', id: 'parent-2' },
      { type: 'topic', id: 'parent-3' },
    ]);
  });

  afterEach(cleanup);

  it('removes the parents to the topic', () => {
    // Remove two parents from the topic
    removeParentsFromTopic(core, tNoDrops.id, [
      { type: 'topic', id: 'parent-1' },
      { type: 'topic', id: 'parent-2' },
    ]);

    // Get the updated topic
    const topic = getTopic(tNoDrops.id);

    // Should no longer contain the two first parents
    expect(
      doesNotContain(topic.parents, [
        { type: 'topic', id: 'parent-1' },
        { type: 'topic', id: 'parent-2' },
      ]),
    ).toBeTruthy();
  });

  it('returns the updated topic', () => {
    // Remove parents from the topic
    const topic = removeParentsFromTopic(core, tNoDrops.id, [
      { type: 'topic', id: 'parent-1' },
    ]);

    // Should be the updated topic
    expect(
      doesNotContain(topic.parents, [{ type: 'topic', id: 'parent-1' }]),
    ).toBeTruthy();
  });

  it('dispatches a `topics:remove-parents` event', (done) => {
    let topic: Topic;

    core.addEventListener('topics:remove-parents', (payload) => {
      // Payload data should contain updated topic
      expect(payload.data.topic).toEqual(topic);
      // Payload data should contain removed parent references
      expect(payload.data.parents).toEqual([{ type: 'topic', id: 'parent-1' }]);
      done();
    });

    // Remove the parent
    topic = removeParentsFromTopic(core, tNoDrops.id, [
      { type: 'topic', id: 'parent-1' },
    ]);
  });

  it('deletes the topic when the last parent is removed', () => {
    // Remove all parents from the topic
    const topic = removeParentsFromTopic(core, tNoDrops.id, [
      { type: 'topic', id: 'parent-1' },
      { type: 'topic', id: 'parent-2' },
      { type: 'topic', id: 'parent-3' },
    ]);

    // Topic should be deleted
    expect(topic.deleted).toBeTruthy();
  });
});

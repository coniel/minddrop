import { contains, isEqual } from '@minddrop/utils';
import { Topic } from '../types';
import { getTopic } from '../getTopic';
import { setup, cleanup, core, tNoDrops } from '../test-utils';
import { addParentsToTopic } from './addParentsToTopic';
import { deleteTopic } from '../deleteTopic';

describe('addParentsToTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the parents to the topic', () => {
    // Add parents to the topic
    addParentsToTopic(core, tNoDrops.id, [
      { type: 'topic', id: 'parent-1' },
      { type: 'topic', id: 'parent-2' },
    ]);

    // Get the updated topic
    const topic = getTopic(tNoDrops.id);

    // Should have new parents
    expect(
      contains(topic.parents, [
        { type: 'topic', id: 'parent-1' },
        { type: 'topic', id: 'parent-2' },
      ]),
    ).toBeTruthy();
  });

  it('returns the updated topic', () => {
    // Add parents to the topic
    const result = addParentsToTopic(core, tNoDrops.id, [
      { type: 'topic', id: 'parent' },
    ]);

    // Get the updated topic
    const topic = getTopic(tNoDrops.id);

    // Should be the updated topic
    expect(topic).toEqual(result);
  });

  it('dispatches a `topics:add-parents` event', (done) => {
    let topic: Topic;

    core.addEventListener('topics:add-parents', (payload) => {
      // Payload data should contain updated topic
      expect(payload.data.topic).toEqual(topic);
      // Payload data should contain added parent references
      expect(payload.data.parents).toEqual([{ type: 'topic', id: 'parent' }]);
      done();
    });

    // Add parents to topic
    topic = addParentsToTopic(core, tNoDrops.id, [
      { type: 'topic', id: 'parent' },
    ]);
  });

  it('restores topic and clears old parents if it was deleted', () => {
    // Add parent to the topic
    let result = addParentsToTopic(core, tNoDrops.id, [
      { type: 'topic', id: 'parent-1' },
    ]);

    // Delete the topic
    deleteTopic(core, result.id);

    // Add another parent to the topic
    result = addParentsToTopic(core, tNoDrops.id, [
      { type: 'topic', id: 'parent-2' },
    ]);

    // Get the updated topic
    const topic = getTopic(tNoDrops.id);

    // Should be restored
    expect(topic.deleted).toBeFalsy();
    // Shold have 'parent-2' as its only parent
    expect(
      isEqual(topic.parents, [{ type: 'topic', id: 'parent-2' }]),
    ).toBeTruthy();
  });
});

import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, Topic_1 } from '../test-utils';
import { updateTopic } from './updateTopic';
import { NotFoundError } from '@minddrop/core';
import { getTopic } from '../getTopic';
import { Events } from '@minddrop/events';

describe('updateTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the topic does not exist', () => {
    // Attempt to update a topic which does not exist.
    // Should throw a NotFoundError.
    expect(() => updateTopic('foo', {})).toThrowError(NotFoundError);
  });

  it('updates the topic in the store', () => {
    // Update a topic's title
    updateTopic(Topic_1.path, { title: 'New title' });

    // Get the topic
    const topic = getTopic(Topic_1.path);

    // Topic title should be updated
    expect(topic?.title).toBe('New title');
  });

  it('dispatches a `topics:topic:update` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'topics:topic:update' events
      Events.addListener('topics:topic:update', 'test', (event) => {
        // Get the updated topic
        const topic = getTopic(Topic_1.path);

        // Event data should be the updated topic
        expect(event.data).toEqual(topic);

        Events.removeListener('topics:topic:update', 'test');
        done();
      });

      // Create a topic
      updateTopic(Topic_1.path, { title: 'New title' });
    }));

  it('returns the updated topic', () => {
    // Update a topic's title
    const updated = updateTopic(Topic_1.path, { title: 'New title' });

    // Should return the updated topic
    expect(updated).toEqual({ ...Topic_1, title: 'New title' });
  });
});

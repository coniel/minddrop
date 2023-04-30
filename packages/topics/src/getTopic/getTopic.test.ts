import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, Topic_1 } from '../test-utils';
import { getTopic } from './getTopic';

describe('getTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the topic', () => {
    // Get a topic
    const topic = getTopic(Topic_1.path);

    // Should return the topic
    expect(topic).toEqual(Topic_1);
  });

  it('returns `null` if a root topic does not exist', () => {
    // Should return null
    expect(getTopic('foo')).toBeNull();
  });
});

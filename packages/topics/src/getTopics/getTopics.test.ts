import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, Topic_1, Topic_2 } from '../test-utils';
import { getTopics } from './getTopics';

describe('getTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns root topics', () => {
    // Get a couple of topics
    const topic = getTopics([Topic_1.path, Topic_2.path]);

    // Should return the topics
    expect(topic).toEqual([Topic_1, Topic_2]);
  });

  it('omits topic if it does not exist', () => {
    // Should return only existing topic
    expect(getTopics([Topic_1.path, 'foo'])).toEqual([Topic_1]);
  });
});

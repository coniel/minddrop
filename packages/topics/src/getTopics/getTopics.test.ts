import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  Topic_1,
  Topic_1_1,
  Topic_1_2,
  Topic_1_2_1,
  Topic_2,
} from '../test-utils';
import { getTopics } from './getTopics';

describe('getTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns root topics', () => {
    // Get a couple of root topics
    const topic = getTopics([Topic_1.filename, Topic_2.filename]);

    // Should return the root topics
    expect(topic).toEqual([Topic_1, Topic_2]);
  });

  it('returns nested topics', () => {
    // Get a couple of nested topics
    const topic = getTopics([
      `${Topic_1.filename}/${Topic_1_2.filename}/${Topic_1_2_1.filename}`,
      `${Topic_1.filename}/${Topic_1_1.filename}`,
    ]);

    // Should return the nested topics
    expect(topic).toEqual([Topic_1_2_1, Topic_1_1]);
  });

  it('omits topic if a root topic does not exist', () => {
    // Should return only existing topic
    expect(getTopics([Topic_1.filename, 'foo'])).toEqual([Topic_1]);
  });

  it('omits topic if a nested topic does not exist', () => {
    // Should return only existing topic
    expect(
      getTopics([
        `${Topic_1.filename}/${Topic_1_1.filename}`,
        `${Topic_1.filename}/foo/${Topic_1_2_1.filename}`,
      ]),
    ).toEqual([Topic_1_1]);
  });
});

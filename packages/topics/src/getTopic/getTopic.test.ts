import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, Topic_1, Topic_1_2, Topic_1_2_1 } from '../test-utils';
import { getTopic } from './getTopic';

describe('getTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns root topics', () => {
    // Get a root topic
    const topic = getTopic(Topic_1.name);

    // Should return the root topic
    expect(topic).toEqual(Topic_1);
  });

  it('returns nested topics', () => {
    // Get a nested topic
    const topic = getTopic(
      `${Topic_1.name}/${Topic_1_2.name}/${Topic_1_2_1.name}`,
    );

    // Should return the nested topic
    expect(topic).toEqual(Topic_1_2_1);
  });

  it('returns `null` if a root topic does not exist', () => {
    // Should return null
    expect(getTopic('foo')).toBeNull();
  });

  it('returns `null` if a nested topic does not exist', () => {
    // Should return null
    expect(getTopic(`${Topic_1.name}/foo/${Topic_1_2_1.name}`)).toBeNull();
  });
});

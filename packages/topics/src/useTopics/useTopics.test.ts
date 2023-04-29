import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import {
  setup,
  cleanup,
  Topic_1,
  Topic_1_1,
  Topic_1_2,
  Topic_1_2_1,
  Topic_2,
} from '../test-utils';
import { useTopics } from './useTopics';

describe('useTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns root topics', () => {
    // Get a couple of root topics
    const { result } = renderHook(() =>
      useTopics([Topic_1.filename, Topic_2.filename]),
    );

    // Should return the root topics
    expect(result.current).toEqual([Topic_1, Topic_2]);
  });

  it('returns nested topics', () => {
    // Get a couple of nested topics
    const { result } = renderHook(() =>
      useTopics([
        `${Topic_1.filename}/${Topic_1_2.filename}/${Topic_1_2_1.filename}`,
        `${Topic_1.filename}/${Topic_1_1.filename}`,
      ]),
    );

    // Should return the nested topics
    expect(result.current).toEqual([Topic_1_2_1, Topic_1_1]);
  });

  it('omits topic if a root topic does not exist', () => {
    // Get a couple of root topics, one of which does not exist
    const { result } = renderHook(() =>
      useTopics([Topic_1.filename, 'missing']),
    );

    // Should return only existing topics
    expect(result.current).toEqual([Topic_1]);
  });

  it('omits topic if a nested topic does not exist', () => {
    // Get a couple of nested topics, one of which does not exist
    const { result } = renderHook(() =>
      useTopics([
        `${Topic_1.filename}/${Topic_1_2.filename}/${Topic_1_2_1.filename}`,
        `${Topic_1.filename}/foo/${Topic_1_2_1.filename}`,
      ]),
    );

    // Should return only existing topics
    expect(result.current).toEqual([Topic_1_2_1]);
  });
});

import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup, Topic_1, Topic_2 } from '../test-utils';
import { useTopics } from './useTopics';

describe('useTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the topics', () => {
    // Get a couple of topics
    const { result } = renderHook(() =>
      useTopics([Topic_1.path, Topic_2.path]),
    );

    // Should return the topics
    expect(result.current).toEqual([Topic_1, Topic_2]);
  });

  it('omits topic if it does not exist', () => {
    // Get a couple of topics, one of which does not exist
    const { result } = renderHook(() => useTopics([Topic_1.path, 'missing']));

    // Should return only existing topics
    expect(result.current).toEqual([Topic_1]);
  });
});

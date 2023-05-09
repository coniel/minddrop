import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup, topics } from '../test-utils';
import { useAllTopics } from './useAllTopics';

describe('useTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all topics', () => {
    // Get all topics
    const { result } = renderHook(() => useAllTopics());

    // Should return all topics
    expect(result.current).toEqual(topics);
  });
});

import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup, Topic_1 } from '../test-utils';
import { useTopic } from './useTopic';

describe('useTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the topic', () => {
    // Get a topic
    const { result } = renderHook(() => useTopic(Topic_1.path));

    // Should return the topic
    expect(result.current).toEqual(Topic_1);
  });

  it('returns `null` if a topic does not exist', () => {
    // Get a topic which does not exist
    const { result } = renderHook(() => useTopic('foo'));

    // Should return null
    expect(result.current).toBeNull();
  });
});

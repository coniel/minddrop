import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup, Topic_1, Topic_1_2, Topic_1_2_1 } from '../test-utils';
import { useTopic } from './useTopic';

describe('useTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns root topics', () => {
    // Get a root topic
    const { result } = renderHook(() => useTopic(Topic_1.filename));

    // Should return the root topic
    expect(result.current).toEqual(Topic_1);
  });

  it('returns nested topics', () => {
    // Get a nested topic
    const { result } = renderHook(() =>
      useTopic(
        `${Topic_1.filename}/${Topic_1_2.filename}/${Topic_1_2_1.filename}`,
      ),
    );

    // Should return the nested topic
    expect(result.current).toEqual(Topic_1_2_1);
  });

  it('returns `null` if a root topic does not exist', () => {
    // Get a root topic which does not exist
    const { result } = renderHook(() => useTopic('foo'));

    // Should return null
    expect(result.current).toBeNull();
  });

  it('returns `null` if a nested topic does not exist', () => {
    // Get a nested topic which does not exist
    const { result } = renderHook(() =>
      useTopic(`${Topic_1.filename}/foo/${Topic_1_2_1.filename}`),
    );

    // Should return null
    expect(result.current).toBeNull();
  });
});

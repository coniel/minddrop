import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
import { useTopicsStore } from '../useTopicsStore';
import { useTopicViews } from './useTopicViews';

describe('useTopicViews', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all registered views', () => {
    const { result } = renderHook(() => useTopicViews());
    expect(result.current).toEqual(useTopicsStore.getState().views);
  });
});

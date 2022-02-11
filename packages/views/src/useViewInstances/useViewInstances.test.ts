import { renderHook } from '@minddrop/test-utils';
import { cleanup, setup, viewInstance1, viewInstance2 } from '../test-utils';
import { useViewInstances } from './useViewInstances';

describe('useViewInstances', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    cleanup();
  });

  it('returns a view instance map', () => {
    const { result } = renderHook(() =>
      useViewInstances([viewInstance1.id, viewInstance2.id]),
    );

    expect(result.current).toEqual({
      [viewInstance1.id]: viewInstance1,
      [viewInstance2.id]: viewInstance2,
    });
  });

  it('sets missing view instances to null', () => {
    const { result } = renderHook(() => useViewInstances(['missing']));

    expect(result.current).toEqual({
      missing: null,
    });
  });
});

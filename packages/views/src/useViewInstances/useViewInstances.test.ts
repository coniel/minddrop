import { renderHook } from '@minddrop/test-utils';
import { cleanup, setup, viewInstance, viewInstance2 } from '../tests';
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
      useViewInstances([viewInstance.id, viewInstance2.id]),
    );

    expect(result.current).toEqual({
      [viewInstance.id]: viewInstance,
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

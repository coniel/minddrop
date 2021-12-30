import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { useGlobalPersistentStore } from './useGlobalPersistentStore';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useGlobalStore', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearScope('global');
    });
  });

  it("returns the extension's data from the global store", () => {
    const { result } = renderHook(() => useGlobalPersistentStore(core));

    const data = { app: { foo: 'foo' } };

    act(() => {
      usePersistentStore.getState().load('global', data);
    });

    expect(result.current).toEqual(data.app);
  });

  it('returns an empty object if extension data is not set', () => {
    const { result } = renderHook(() => useGlobalPersistentStore(core));

    expect(result.current).toEqual({});
  });
});

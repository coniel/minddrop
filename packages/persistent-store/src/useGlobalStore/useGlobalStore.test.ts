import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { useGlobalStore } from './useGlobalStore';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useGlobalStore', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearChache('global');
    });
  });

  it("returns the extension's data from the global store", () => {
    const { result } = renderHook(() => useGlobalStore(core));

    const data = { app: { foo: 'foo' } };

    act(() => {
      usePersistentStore.getState().load('global', data);
    });

    expect(result.current).toEqual(data.app);
  });

  it('returns an empty object if extension data is not set', () => {
    const { result } = renderHook(() => useGlobalStore(core));

    expect(result.current).toEqual({});
  });
});

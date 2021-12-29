import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { useLocalStore } from './useLocalStore';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useLocalStore', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearScope('global');
    });
  });

  it("returns the extension's data from the global store", () => {
    const { result } = renderHook(() => useLocalStore(core));

    const data = { app: { foo: 'foo' } };

    act(() => {
      usePersistentStore.getState().load('global', data);
    });

    expect(result.current).toEqual(data.app);
  });

  it('returns an empty object if extension data is not set', () => {
    const { result } = renderHook(() => useLocalStore(core));

    expect(result.current).toEqual({});
  });
});

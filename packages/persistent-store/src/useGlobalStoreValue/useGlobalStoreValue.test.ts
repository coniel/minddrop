import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { useGlobalStoreValue } from './useGlobalStoreValue';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useGlobalStoreValue', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearChache('global');
    });
  });

  it("returns the value from the extension's global data", () => {
    const { result } = renderHook(() => useGlobalStoreValue(core, 'foo'));

    const data = { app: { foo: 'foo' } };

    act(() => {
      usePersistentStore.getState().load('global', data);
    });

    expect(result.current).toEqual(data.app.foo);
  });
});

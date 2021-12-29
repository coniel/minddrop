import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { useLocalStoreValue } from './useLocalStoreValue';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useLocalStoreValue', () => {
  afterEach(() => {
    act(() => {
      usePersistentStore.getState().clearScope('global');
    });
  });

  it("returns the value from the extension's global data", () => {
    const { result } = renderHook(() => useLocalStoreValue(core, 'foo'));

    const data = { app: { foo: 'foo' } };

    act(() => {
      usePersistentStore.getState().load('global', data);
    });

    expect(result.current).toEqual(data.app.foo);
  });
});

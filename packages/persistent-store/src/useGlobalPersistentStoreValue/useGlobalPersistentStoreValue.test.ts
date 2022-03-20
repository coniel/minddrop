import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { useGlobalPersistentStoreValue } from './useGlobalPersistentStoreValue';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useGlobalStoreValue', () => {
  afterEach(cleanup);

  it("returns the value from the extension's global data", () => {
    const { result } = renderHook(() =>
      useGlobalPersistentStoreValue(core, 'foo'),
    );

    // The store
    const store = { id: 'doc-id', data: { app: { foo: 'foo' } } };

    act(() => {
      // Load the store as the global store
      usePersistentStore.getState().load('global', store);
    });

    // Should return the value from the extension's global store
    expect(result.current).toEqual(store.data.app.foo);
  });

  it('returns the default value if the value is not set', () => {
    // Request a value which is not set
    const { result } = renderHook(() =>
      useGlobalPersistentStoreValue(core, 'bar', 'foo'),
    );

    // Should return default value
    expect(result.current).toEqual('foo');
  });
});

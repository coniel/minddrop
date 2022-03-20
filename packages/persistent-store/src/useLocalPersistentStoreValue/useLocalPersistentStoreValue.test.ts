import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { useLocalPersistentStoreValue } from './useLocalPersistentStoreValue';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useLocalStoreValue', () => {
  afterEach(cleanup);

  it("returns the value from the extension's local data", () => {
    const { result } = renderHook(() =>
      useLocalPersistentStoreValue(core, 'foo'),
    );

    // The store
    const store = { id: 'doc-id', data: { app: { foo: 'foo' } } };

    act(() => {
      // Load the store as the local store
      usePersistentStore.getState().load('local', store);
    });

    // Should return the value from the extension's local store
    expect(result.current).toEqual(store.data.app.foo);
  });

  it('returns the default value if the value is not set', () => {
    // Request a value which is not set
    const { result } = renderHook(() =>
      useLocalPersistentStoreValue(core, 'bar', 'foo'),
    );

    // Should return default value
    expect(result.current).toEqual('foo');
  });
});

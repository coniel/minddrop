import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { useLocalPersistentStore } from './useLocalPersistentStore';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useLocalStore', () => {
  afterEach(cleanup);

  it("returns the extension's data from the local store", () => {
    const { result } = renderHook(() => useLocalPersistentStore(core));

    // The store
    const store = { id: 'doc-id', data: { app: { foo: 'foo' } } };

    act(() => {
      // Load the store as the local store
      usePersistentStore.getState().load('local', store);
    });

    // Should return the extension's local store
    expect(result.current).toEqual(store.data.app);
  });

  it('returns an empty object if extension data is not set', () => {
    // Request a store which is not set
    const { result } = renderHook(() => useLocalPersistentStore(core));

    // Should return an empty object
    expect(result.current).toEqual({});
  });
});

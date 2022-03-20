import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { useGlobalPersistentStore } from './useGlobalPersistentStore';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('useGlobalStore', () => {
  afterEach(cleanup);

  it("returns the extension's data from the global store", () => {
    const { result } = renderHook(() => useGlobalPersistentStore(core));

    // The store
    const store = { id: 'doc-id', data: { app: { foo: 'foo' } } };

    act(() => {
      // Load the store as the global store
      usePersistentStore.getState().load('global', store);
    });

    // Should return the extension's global store
    expect(result.current).toEqual(store.data.app);
  });

  it('returns an empty object if extension data is not set', () => {
    // Request a store which is not set
    const { result } = renderHook(() => useGlobalPersistentStore(core));

    // Should return an empty object
    expect(result.current).toEqual({});
  });
});

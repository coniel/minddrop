import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { getStore } from './getStore';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('getStore', () => {
  afterEach(cleanup);

  it("returns the extension's data from the store scope", () => {
    // The store
    const store = { id: 'doc-id', data: { app: { foo: 'foo' } } };

    // Load the store as the local store
    usePersistentStore.getState().load('local', store);

    // Get the 'app' extension's local store
    const result = getStore('local', core);

    // Should return the 'app' extension's local store
    expect(result).toEqual(store.data.app);
  });

  it('returns an empty object if extension data is not set', () => {
    // Get the 'app' extension's global store which is not set
    const result = getStore('global', core);

    // Should return an empty object
    expect(result).toEqual({});
  });
});

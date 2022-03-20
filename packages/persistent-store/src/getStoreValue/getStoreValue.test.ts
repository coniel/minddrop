import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { getStoreValue } from './getStoreValue';
import { usePersistentStore } from '../usePersistentStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('getStoreValue', () => {
  afterEach(cleanup);

  it('returns the value', () => {
    // The store
    const store = { id: 'doc-id', data: { app: { foo: 'foo' } } };

    // Load the store as the local store
    usePersistentStore.getState().load('local', store);

    // Get a value from the 'app' extension's local store
    const result = getStoreValue('local', core, 'foo');

    // Should return the value from the extension's local store
    expect(result).toEqual(store.data.app.foo);
  });

  it('returns undefined if store does not exist', () => {
    const result = getStoreValue('global', core, 'foo');

    expect(result).toBeUndefined();
  });

  it('returns default value if store does not exist', () => {
    // Get a value from a store which does not exist
    const result = getStoreValue('global', core, 'foo', 'bar');

    // Should return the default value
    expect(result).toEqual('bar');
  });

  it('returns default value if value is not set', () => {
    // The store
    const store = { id: 'doc-id', data: { app: {} } };

    // Load the store as the local store
    usePersistentStore.getState().load('local', store);

    // Get a missing value from the 'app' extension's local store
    const result = getStoreValue('local', core, 'foo', 'bar');

    // Should return the default value
    expect(result).toEqual('bar');
  });
});

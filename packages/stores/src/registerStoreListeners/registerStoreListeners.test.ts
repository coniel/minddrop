import { afterEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { createKeyValueStore } from '../createKeyValueStore';
import { registerStoreListeners } from './registerStoreListeners';

// Mock file system backing the persist and hydrate paths
const MockFs = initializeMockFileSystem();

// Test store persisted at the app-config level
const appLevelStore = createKeyValueStore<{ value: string }>(
  'Test:StoreListenersAppLevel',
  { value: 'default' },
  { persistTo: 'app-config', namespace: 'test-app-level' },
);

// Test store persisted at the workspace-config level
const workspaceLevelStore = createKeyValueStore<{ value: string }>(
  'Test:StoreListenersWorkspaceLevel',
  { value: 'default' },
  { persistTo: 'workspace-config', namespace: 'test-workspace-level' },
);

// Listener config matching the app-config level test store
const config = {
  listenerId: 'test:store-listeners',
  persistTo: 'app-config' as const,
  getStoresDir: () => 'stores',
};

// Events.dispatch awaits each listener, so listeners run on the
// microtask queue. Yielding to a macrotask drains them.
const flushEvents = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('registerStoreListeners', () => {
  // The cleanup function returned by the registration under test
  let removeListeners: VoidFunction = () => {};

  afterEach(() => {
    // Remove the listeners registered during the test
    removeListeners();

    // Restore the test stores to their default values
    appLevelStore.load({ value: 'default' });
    workspaceLevelStore.load({ value: 'default' });

    // Clear all files from the mock file system
    MockFs.reset();
  });

  it('persists matching store data to a JSON file', async () => {
    // Register the store listeners
    removeListeners = registerStoreListeners(config);

    // Set a value on a store matching the configured persist level
    appLevelStore.set('value', 'updated');

    // Wait for async event dispatch
    await flushEvents();

    // Should create the stores directory
    expect(MockFs.exists('stores')).toBe(true);

    // Should write the store data to the store's JSON file
    expect(MockFs.readJsonFile('stores/test-app-level.json')).toEqual({
      value: 'updated',
    });
  });

  it('ignores stores persisted at other levels', async () => {
    // Register the store listeners
    removeListeners = registerStoreListeners(config);

    // Set a value on a store persisted at a different level
    workspaceLevelStore.set('value', 'updated');

    // Wait for async event dispatch
    await flushEvents();

    // Should not write a store file
    expect(MockFs.exists('stores/test-workspace-level.json')).toBe(false);
  });

  it('hydrates a store from its persisted file', async () => {
    // Write persisted store data to the mock file system
    MockFs.createDir('stores');
    MockFs.writeJsonFile('stores/test-app-level.json', { value: 'persisted' });

    // Register the store listeners
    removeListeners = registerStoreListeners(config);

    // Hydrate the store
    await appLevelStore.hydrate();

    // Should load the persisted data into the store
    expect(appLevelStore.get('value')).toBe('persisted');
  });

  it('hydrates a store with empty data when no file exists', async () => {
    // Register the store listeners
    removeListeners = registerStoreListeners(config);

    // Hydrate the store, which resolves only if the listeners
    // respond to the hydrate request
    await appLevelStore.hydrate();

    // Should leave the store with its default values
    expect(appLevelStore.get('value')).toBe('default');
  });

  it('removes the listeners when the cleanup function is called', async () => {
    // Register the store listeners
    removeListeners = registerStoreListeners(config);

    // Remove the listeners
    removeListeners();

    // Set a value on a store matching the configured persist level
    appLevelStore.set('value', 'updated');

    // Wait for async event dispatch
    await flushEvents();

    // Should not write a store file
    expect(MockFs.exists('stores/test-app-level.json')).toBe(false);
  });
});

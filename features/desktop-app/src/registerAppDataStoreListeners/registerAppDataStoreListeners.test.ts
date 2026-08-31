import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createKeyValueStore } from '@minddrop/stores';
import { MockFs, cleanup } from '../test-utils';
import { registerAppDataStoreListeners } from './registerAppDataStoreListeners';

// Test store persisted at the app-config level
const store = createKeyValueStore<{ value: string }>(
  'Test:AppDataStoreListeners',
  { value: 'default' },
  { persistTo: 'app-config', namespace: 'test-app-data' },
);

// Events.dispatch awaits each listener, so listeners run on the
// microtask queue. Yielding to a macrotask drains them.
const flushEvents = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('registerAppDataStoreListeners', () => {
  // The cleanup function returned by the registration under test
  let removeListeners: VoidFunction = () => {};

  beforeEach(() => {
    // Create the AppData stores directory. The mock file system
    // resolves recursive directory creation against the root,
    // ignoring the base directory, so the listeners cannot create
    // it themselves in tests.
    MockFs.createDir('app-data/stores', { recursive: true });
  });

  afterEach(() => {
    // Remove the listeners registered during the test
    removeListeners();

    // Restore the test store to its default values
    store.load({ value: 'default' });

    cleanup();
  });

  it('persists app-config store data to the AppData stores directory', async () => {
    // Register the store listeners
    removeListeners = registerAppDataStoreListeners();

    // Set a value on an app-config level store
    store.set('value', 'updated');

    // Wait for async event dispatch
    await flushEvents();

    // Should write the store data to the AppData stores directory
    expect(MockFs.readJsonFile('app-data/stores/test-app-data.json')).toEqual({
      value: 'updated',
    });
  });

  it('hydrates app-config stores from the AppData stores directory', async () => {
    // Write persisted store data to the AppData stores directory
    MockFs.writeJsonFile('app-data/stores/test-app-data.json', {
      value: 'persisted',
    });

    // Register the store listeners
    removeListeners = registerAppDataStoreListeners();

    // Hydrate the store
    await store.hydrate();

    // Should load the persisted data into the store
    expect(store.get('value')).toBe('persisted');
  });
});

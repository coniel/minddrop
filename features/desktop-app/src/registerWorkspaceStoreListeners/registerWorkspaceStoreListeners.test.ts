import { afterEach, describe, expect, it } from 'vitest';
import { createKeyValueStore } from '@minddrop/stores';
import { Paths } from '@minddrop/utils';
import { MockFs, cleanup } from '../test-utils';
import { registerWorkspaceStoreListeners } from './registerWorkspaceStoreListeners';

// Test store persisted at the workspace-config level
const store = createKeyValueStore<{ value: string }>(
  'Test:WorkspaceStoreListeners',
  { value: 'default' },
  { persistTo: 'workspace-config', namespace: 'test-workspace-data' },
);

// Events.dispatch awaits each listener, so listeners run on the
// microtask queue. Yielding to a macrotask drains them.
const flushEvents = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('registerWorkspaceStoreListeners', () => {
  // The cleanup function returned by the registration under test
  let removeListeners: VoidFunction = () => {};

  afterEach(() => {
    // Remove the listeners registered during the test
    removeListeners();

    // Restore the test store to its default values
    store.load({ value: 'default' });

    cleanup();
  });

  it('persists workspace-config store data to the workspace stores directory', async () => {
    // Register the store listeners
    removeListeners = registerWorkspaceStoreListeners();

    // Set a value on a workspace-config level store
    store.set('value', 'updated');

    // Wait for async event dispatch
    await flushEvents();

    // Should write the store data to the workspace stores directory
    expect(
      MockFs.readJsonFile(
        `${Paths.workspaceConfigs}/stores/test-workspace-data.json`,
      ),
    ).toEqual({ value: 'updated' });
  });

  it('hydrates workspace-config stores from the workspace stores directory', async () => {
    // Write persisted store data to the workspace stores directory
    MockFs.createDir(`${Paths.workspaceConfigs}/stores`, { recursive: true });
    MockFs.writeJsonFile(
      `${Paths.workspaceConfigs}/stores/test-workspace-data.json`,
      { value: 'persisted' },
    );

    // Register the store listeners
    removeListeners = registerWorkspaceStoreListeners();

    // Hydrate the store
    await store.hydrate();

    // Should load the persisted data into the store
    expect(store.get('value')).toBe('persisted');
  });
});

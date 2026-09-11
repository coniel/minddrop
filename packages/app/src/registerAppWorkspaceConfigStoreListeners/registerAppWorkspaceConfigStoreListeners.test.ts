import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createKeyValueStore } from '@minddrop/stores';
import { Workspaces } from '@minddrop/workspaces';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { MockFs, cleanup } from '../test-utils';
import { registerAppWorkspaceConfigStoreListeners } from './registerAppWorkspaceConfigStoreListeners';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

// Test store persisted at the app-workspace-config level
const store = createKeyValueStore<{ value: string }>(
  'Test:AppWorkspaceStoreListeners',
  { value: 'default' },
  {
    persistTo: 'app-workspace-config',
    namespace: 'test-app-workspace-data',
  },
);

// The stores directory inside a workspace's data directory
const storesDir = (workspaceId: string) =>
  `app-data/workspaces/${workspaceId}/stores`;

// Events.dispatch awaits each listener, so listeners run on the
// microtask queue. Yielding to a macrotask drains them.
const flushEvents = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('registerAppWorkspaceConfigStoreListeners', () => {
  // The cleanup function returned by the registration under test
  let removeListeners: VoidFunction = () => {};

  beforeEach(() => {
    // Load the workspaces and make one of them active
    Workspaces.Store.load([workspace_1, workspace_2]);
    Workspaces.ActiveStore.set('id', workspace_1.id);
  });

  afterEach(async () => {
    // Remove the listeners registered during the test
    removeListeners();

    // Restore the test store to its default values
    store.load({ value: 'default' });

    Workspaces.Store.clear();
    Workspaces.ActiveStore.reset();

    await cleanup();
  });

  it('persists store data to the active workspace stores directory', async () => {
    // Register the store listeners
    removeListeners = registerAppWorkspaceConfigStoreListeners();

    // Set a value on an app-workspace-config level store
    store.set('value', 'updated');

    // Wait for async event dispatch
    await flushEvents();

    // Should write the store data under the active workspace's ID
    expect(
      MockFs.readJsonFile(
        `${storesDir(workspace_1.id)}/test-app-workspace-data.json`,
      ),
    ).toEqual({ value: 'updated' });

    // Should not write it under any other workspace's ID
    expect(
      MockFs.exists(
        `${storesDir(workspace_2.id)}/test-app-workspace-data.json`,
      ),
    ).toBe(false);
  });

  it('hydrates stores from the active workspace stores directory', async () => {
    // Write persisted store data to each workspace's stores directory.
    // The mock file system does not create parent directories when
    // writing a file, so create them first.
    MockFs.createDir(storesDir(workspace_1.id), { recursive: true });
    MockFs.createDir(storesDir(workspace_2.id), { recursive: true });
    MockFs.writeJsonFile(
      `${storesDir(workspace_1.id)}/test-app-workspace-data.json`,
      { value: 'workspace 1 data' },
    );
    MockFs.writeJsonFile(
      `${storesDir(workspace_2.id)}/test-app-workspace-data.json`,
      { value: 'workspace 2 data' },
    );

    // Register the store listeners
    removeListeners = registerAppWorkspaceConfigStoreListeners();

    // Hydrate the store
    await store.hydrate();

    // Should load the active workspace's data into the store
    expect(store.get('value')).toBe('workspace 1 data');
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createKeyValueStore, setActiveWorkspaceScope } from '@minddrop/stores';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { MockFs, cleanup } from '../test-utils';
import { registerWorkspaceConfigStoreListeners } from './registerWorkspaceConfigStoreListeners';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

// Test store persisted at the workspace-config level
const store = createKeyValueStore<{ value: string }>(
  'Test:WorkspaceStoreListeners',
  { value: 'default' },
  {
    persist: {
      target: 'workspace-config',
      namespace: 'test-workspace-data',
    },
  },
);

// Test store scoped by workspace, persisted at the same level
const scopedStore = createKeyValueStore<{ value: string }>(
  'Test:WorkspaceStoreListenersScoped',
  { value: 'default' },
  {
    scope: 'workspace',
    persist: {
      target: 'workspace-config',
      namespace: 'test-workspace-scoped',
    },
  },
);

// The stores directory inside a workspace's config directory
const storesDir = (workspacePath: string) =>
  `${workspacePath}/${Paths.hiddenDirName}/stores`;

// Events.dispatch awaits each listener, so listeners run on the
// microtask queue. Yielding to a macrotask drains them.
const flushEvents = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('registerWorkspaceConfigStoreListeners', () => {
  // The cleanup function returned by the registration under test
  let removeListeners: VoidFunction = () => {};

  beforeEach(() => {
    // Load the workspaces and make one of them active
    Workspaces.Store.load([workspace_1, workspace_2]);
    Workspaces.ActiveStore.set('id', workspace_1.id);
    setActiveWorkspaceScope(workspace_1.id);
  });

  afterEach(async () => {
    // Remove the listeners registered during the test
    removeListeners();

    // Restore the test stores to their default values
    store.load({ value: 'default' });
    scopedStore.in(workspace_1.id).load({ value: 'default' });
    scopedStore.in(workspace_2.id).load({ value: 'default' });

    Workspaces.Store.clear();
    Workspaces.ActiveStore.reset();
    setActiveWorkspaceScope(null);

    await cleanup();
  });

  it('persists store data to the active workspace stores directory', async () => {
    // Register the store listeners
    removeListeners = registerWorkspaceConfigStoreListeners();

    // Set a value on a workspace-config level store
    store.set('value', 'updated');

    // Wait for async event dispatch
    await flushEvents();

    // Should write the store data to the active workspace's stores
    // directory.
    expect(
      MockFs.readJsonFile(
        `${storesDir(workspace_1.path)}/test-workspace-data.json`,
      ),
    ).toEqual({ value: 'updated' });

    // Should not write it to any other workspace
    expect(
      MockFs.exists(`${storesDir(workspace_2.path)}/test-workspace-data.json`),
    ).toBe(false);
  });

  it('persists scoped store data to the stores directory of the workspace written to', async () => {
    // Register the store listeners
    removeListeners = registerWorkspaceConfigStoreListeners();

    // Set a value on another workspace's record
    scopedStore.in(workspace_2.id).set('value', 'updated');

    // Wait for async event dispatch
    await flushEvents();

    // Should write the store data to that workspace's stores directory
    expect(
      MockFs.readJsonFile(
        `${storesDir(workspace_2.path)}/test-workspace-scoped.json`,
      ),
    ).toEqual({ value: 'updated' });

    // Should not write it to the active workspace
    expect(
      MockFs.exists(
        `${storesDir(workspace_1.path)}/test-workspace-scoped.json`,
      ),
    ).toBe(false);
  });

  it('hydrates stores from the active workspace stores directory', async () => {
    // Write persisted store data to each workspace's stores directory.
    // The mock file system does not create parent directories when
    // writing a file, so create them first.
    MockFs.createDir(storesDir(workspace_1.path), { recursive: true });
    MockFs.createDir(storesDir(workspace_2.path), { recursive: true });
    MockFs.writeJsonFile(
      `${storesDir(workspace_1.path)}/test-workspace-data.json`,
      { value: 'workspace 1 data' },
    );
    MockFs.writeJsonFile(
      `${storesDir(workspace_2.path)}/test-workspace-data.json`,
      { value: 'workspace 2 data' },
    );

    // Register the store listeners
    removeListeners = registerWorkspaceConfigStoreListeners();

    // Hydrate the store
    await store.hydrate();

    // Should load the active workspace's data into the store
    expect(store.get('value')).toBe('workspace 1 data');
  });

  it('hydrates scoped stores from the stores directory of the workspace requested', async () => {
    // Write persisted store data to each workspace's stores directory
    MockFs.createDir(storesDir(workspace_1.path), { recursive: true });
    MockFs.createDir(storesDir(workspace_2.path), { recursive: true });
    MockFs.writeJsonFile(
      `${storesDir(workspace_1.path)}/test-workspace-scoped.json`,
      { value: 'workspace 1 data' },
    );
    MockFs.writeJsonFile(
      `${storesDir(workspace_2.path)}/test-workspace-scoped.json`,
      { value: 'workspace 2 data' },
    );

    // Register the store listeners
    removeListeners = registerWorkspaceConfigStoreListeners();

    // Hydrate another workspace's record
    await scopedStore.in(workspace_2.id).hydrate();

    // Should load that workspace's data into its record only
    expect(scopedStore.in(workspace_2.id).get('value')).toBe(
      'workspace 2 data',
    );
    expect(scopedStore.get('value')).toBe('default');
  });
});

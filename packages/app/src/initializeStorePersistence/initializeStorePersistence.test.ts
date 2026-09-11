import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createKeyValueStore } from '@minddrop/stores';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { MockFs, cleanup } from '../test-utils';
import { initializeStorePersistence } from './initializeStorePersistence';

const { workspace_1 } = WorkspaceFixtures;

// One store per persist target
const appConfigStore = createKeyValueStore<{ value: string }>(
  'Test:AppConfigPersistence',
  { value: 'default' },
  { persist: { target: 'app-config', namespace: 'test-app-config' } },
);
const workspaceConfigStore = createKeyValueStore<{ value: string }>(
  'Test:WorkspaceConfigPersistence',
  { value: 'default' },
  {
    persist: {
      target: 'workspace-config',
      namespace: 'test-workspace-config',
    },
  },
);
const appWorkspaceConfigStore = createKeyValueStore<{ value: string }>(
  'Test:AppWorkspaceConfigPersistence',
  { value: 'default' },
  {
    persist: {
      target: 'app-workspace-config',
      namespace: 'test-app-workspace-config',
    },
  },
);

// Where each target's listener writes
const appConfigDir = 'app-data/stores';
const workspaceConfigDir = `${Paths.workspaceConfigs}/stores`;
const appWorkspaceConfigDir = `app-data/workspaces/${workspace_1.id}/stores`;

// Events.dispatch awaits each listener, so listeners run on the
// microtask queue. Yielding to a macrotask drains them.
const flushEvents = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('initializeStorePersistence', () => {
  // The cleanup function returned by the initialization under test
  let removeListeners: VoidFunction = () => {};

  beforeEach(() => {
    // Load a workspace and make it active, so the workspace scoped
    // listeners can resolve their directories.
    Workspaces.Store.load([workspace_1]);
    Workspaces.ActiveStore.set('id', workspace_1.id);

    // Create the stores directories. The mock file system resolves
    // recursive directory creation against the root, ignoring the base
    // directory, so the listeners cannot create them in tests.
    MockFs.createDir(appConfigDir, { recursive: true });
    MockFs.createDir(workspaceConfigDir, { recursive: true });
    MockFs.createDir(appWorkspaceConfigDir, { recursive: true });
  });

  afterEach(async () => {
    // Remove the listeners registered during the test
    removeListeners();

    // Restore the test stores to their default values
    appConfigStore.load({ value: 'default' });
    workspaceConfigStore.load({ value: 'default' });
    appWorkspaceConfigStore.load({ value: 'default' });

    Workspaces.Store.clear();
    Workspaces.ActiveStore.reset();

    await cleanup();
  });

  it('persists stores of every target', async () => {
    removeListeners = initializeStorePersistence();

    appConfigStore.set('value', 'app');
    workspaceConfigStore.set('value', 'workspace');
    appWorkspaceConfigStore.set('value', 'app workspace');

    // Wait for async event dispatch
    await flushEvents();

    expect(MockFs.readJsonFile(`${appConfigDir}/test-app-config.json`)).toEqual(
      {
        value: 'app',
      },
    );
    expect(
      MockFs.readJsonFile(`${workspaceConfigDir}/test-workspace-config.json`),
    ).toEqual({ value: 'workspace' });
    expect(
      MockFs.readJsonFile(
        `${appWorkspaceConfigDir}/test-app-workspace-config.json`,
      ),
    ).toEqual({ value: 'app workspace' });
  });

  it('stops persisting once the listeners are removed', async () => {
    initializeStorePersistence()();

    appConfigStore.set('value', 'app');

    // Wait for async event dispatch
    await flushEvents();

    expect(MockFs.exists(`${appConfigDir}/test-app-config.json`)).toBe(false);
  });
});

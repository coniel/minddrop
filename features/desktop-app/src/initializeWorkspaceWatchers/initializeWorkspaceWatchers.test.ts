import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { FileSystemChangedEventData, Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import {
  WorkspaceFixtures,
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { MockFs, cleanup } from '../test-utils';
import { initializeWorkspaceWatchers } from './initializeWorkspaceWatchers';

// workspace_1 is the active workspace the fixtures set up
const { workspace_1, workspace_2, workspacesRootPath } = WorkspaceFixtures;
const notePath = `${workspace_1.path}/note.md`;
const otherNotePath = `${workspace_2.path}/note.md`;

// Changes dispatched by the file system watchers
let changes: FileSystemChangedEventData[] = [];

describe('initializeWorkspaceWatchers', () => {
  // The cleanup function returned by the initialization under test
  let stopWatchers: VoidFunction = () => {};

  beforeEach(() => {
    vi.useFakeTimers();
    changes = [];

    setupWorkspaceFixtures(MockFs);
    MockFs.addFiles([notePath, otherNotePath]);

    // Collect the changes dispatched by the file system watchers
    Events.addListener(Fs.events.Changed, 'test', (change) => {
      changes.push(change);
    });
  });

  afterEach(async () => {
    stopWatchers();
    Events.removeListener(Fs.events.Changed, 'test');

    vi.useRealTimers();

    cleanupWorkspaceFixtures();

    await cleanup();
  });

  it('watches every loaded workspace', async () => {
    Workspaces.LoadedStore.set('ids', [workspace_1.id, workspace_2.id]);

    stopWatchers = initializeWorkspaceWatchers();

    await modify(notePath);
    await modify(otherNotePath);

    expect(changes.map((change) => change.workspaceId)).toEqual([
      workspace_1.id,
      workspace_2.id,
    ]);
  });

  it('does not watch workspaces which are not loaded', async () => {
    Workspaces.LoadedStore.set('ids', [workspace_1.id]);

    stopWatchers = initializeWorkspaceWatchers();

    await modify(otherNotePath);

    expect(changes).toEqual([]);
  });

  it('watches a workspace once it loads', async () => {
    stopWatchers = initializeWorkspaceWatchers();

    Events.dispatch(Workspaces.events.WorkspaceLoaded, workspace_2);

    await flushEvents();
    await modify(otherNotePath);

    expect(changes.map((change) => change.workspaceId)).toEqual([
      workspace_2.id,
    ]);
  });

  it('stops watching a removed workspace', async () => {
    Workspaces.LoadedStore.set('ids', [workspace_2.id]);

    stopWatchers = initializeWorkspaceWatchers();

    Events.dispatch(Workspaces.events.Deleted, workspace_2);

    await flushEvents();
    await modify(otherNotePath);

    expect(changes).toEqual([]);
  });

  it("watches the new directory when a workspace's directory moves", async () => {
    const movedPath = `${workspacesRootPath}/Renamed`;
    const movedNotePath = `${movedPath}/note.md`;

    Workspaces.LoadedStore.set('ids', [workspace_2.id]);

    stopWatchers = initializeWorkspaceWatchers();

    MockFs.addFiles([movedNotePath]);
    Events.dispatch(Workspaces.events.Updated, {
      original: workspace_2,
      updated: { ...workspace_2, path: movedPath },
    });

    await flushEvents();
    await modify(otherNotePath);
    await modify(movedNotePath);

    // Only the change under the new directory is reported
    expect(changes.map((change) => change.path)).toEqual([movedNotePath]);
  });

  it('keeps the watcher when a workspace is updated in place', async () => {
    Workspaces.LoadedStore.set('ids', [workspace_2.id]);

    stopWatchers = initializeWorkspaceWatchers();

    Events.dispatch(Workspaces.events.Updated, {
      original: workspace_2,
      updated: { ...workspace_2, icon: 'lucide:box:red' },
    });

    await flushEvents();
    await modify(otherNotePath);

    expect(changes.map((change) => change.workspaceId)).toEqual([
      workspace_2.id,
    ]);
  });

  it('stops every watcher on cleanup', async () => {
    Workspaces.LoadedStore.set('ids', [workspace_1.id, workspace_2.id]);

    stopWatchers = initializeWorkspaceWatchers();
    stopWatchers();

    await modify(notePath);
    await modify(otherNotePath);

    expect(changes).toEqual([]);
  });
});

/**
 * Modifies a file outside the app and lets the watchers' debounce
 * window elapse.
 */
async function modify(path: string): Promise<void> {
  await flushEvents();

  MockFs.writeTextFile(path, `Edited outside the app ${changes.length}`);
  MockFs.dispatchWatchEvent('modify', [path]);

  await vi.advanceTimersByTimeAsync(300);
}

/**
 * Lets the queued event listeners and watcher starts run.
 */
async function flushEvents(): Promise<void> {
  await vi.advanceTimersByTimeAsync(0);
}

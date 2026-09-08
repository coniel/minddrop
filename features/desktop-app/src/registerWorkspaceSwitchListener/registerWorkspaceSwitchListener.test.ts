import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { FileSystemChangedEventData, Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { MockFs, cleanup } from '../test-utils';
import { registerWorkspaceSwitchListener } from './registerWorkspaceSwitchListener';

const { workspace_2 } = WorkspaceFixtures;
const notePath = `${workspace_2.path}/note.md`;

// Changes dispatched by the file system watcher
let changes: FileSystemChangedEventData[] = [];

// How many times the app was reloaded
let reloads = 0;

describe('registerWorkspaceSwitchListener', () => {
  // The cleanup function returned by the registration under test
  let removeListener: VoidFunction = () => {};

  beforeEach(() => {
    vi.useFakeTimers();
    changes = [];
    reloads = 0;

    // Count reloads instead of navigating the test environment
    vi.stubGlobal('location', {
      reload: () => {
        reloads += 1;
      },
    });

    MockFs.addFiles([notePath]);

    // Collect the changes dispatched by the file system watcher
    Events.addListener(Fs.events.Changed, 'test', (change) => {
      changes.push(change);
    });
  });

  afterEach(async () => {
    // Remove the listeners registered during the test
    removeListener();
    Events.removeListener(Fs.events.Changed, 'test');

    vi.unstubAllGlobals();
    vi.useRealTimers();

    await cleanup();
  });

  it('reloads the app when the active workspace changes', async () => {
    removeListener = registerWorkspaceSwitchListener(() => undefined);

    Events.dispatch(Workspaces.events.ActiveChanged, workspace_2);

    await flushEvents();

    expect(reloads).toBe(1);
  });

  it('stops the file system watcher', async () => {
    // Watch the workspace the app is about to leave
    const stopWatcher = await Fs.startWatcher([workspace_2.path]);

    removeListener = registerWorkspaceSwitchListener(stopWatcher);

    Events.dispatch(Workspaces.events.ActiveChanged, workspace_2);

    await flushEvents();

    // Change a file in the workspace that was being watched
    MockFs.writeTextFile(notePath, 'Edited outside the app');
    MockFs.dispatchWatchEvent('modify', [notePath]);

    await flushDebounce();

    // Should not dispatch a file system change
    expect(changes).toEqual([]);
  });
});

/**
 * Lets the queued event listeners run.
 */
async function flushEvents(): Promise<void> {
  await vi.advanceTimersByTimeAsync(0);
}

/**
 * Advances past the file system watcher's debounce window, letting
 * the promises it awaits resolve.
 */
async function flushDebounce(): Promise<void> {
  await vi.advanceTimersByTimeAsync(300);
}

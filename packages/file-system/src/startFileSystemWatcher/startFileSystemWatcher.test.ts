import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '../FileSystem';
import { FileSystemChangedEvent, FileSystemChangedEventData } from '../events';
import { initializeMockFileSystem } from '../mock';
import { FileSystemChange } from '../types';
import { clearWriteRegistry } from '../writeRegistry';
import { startFileSystemWatcher } from './startFileSystemWatcher';

const WorkspacePath = 'workspace';
const QueryPath = 'workspace/.minddrop/queries/query_1.json';
const QueryContents = '{ "id": "query_1" }';

const MockFileSystem = initializeMockFileSystem([
  WorkspacePath,
  'workspace/.minddrop',
  'workspace/.minddrop/queries',
  { path: QueryPath, textContent: QueryContents },
]);

// Changes dispatched by the watcher
let changes: FileSystemChange[] = [];

// Stops the watcher started by the test
let stopWatcher: VoidFunction = () => undefined;

describe('startFileSystemWatcher', () => {
  beforeEach(async () => {
    vi.useFakeTimers();

    MockFileSystem.reset();
    changes = [];

    // Collect the changes dispatched by the watcher
    Events.on<FileSystemChangedEventData>(
      FileSystemChangedEvent,
      'test',
      ({ data }) => {
        changes.push(data);
      },
    );

    stopWatcher = await startFileSystemWatcher([WorkspacePath]);
  });

  afterEach(() => {
    stopWatcher();
    Events._clearAll();
    clearWriteRegistry();
    vi.useRealTimers();
  });

  it('dispatches a modified change for an externally modified file', async () => {
    // Modify a file outside of the app
    MockFileSystem.writeTextFile(QueryPath, '{ "id": "query_1", "v": 2 }');
    MockFileSystem.dispatchWatchEvent('modify', [QueryPath]);

    await flushDebounce();

    // Should dispatch a modified change
    expect(changes).toEqual([{ path: QueryPath, kind: 'modified' }]);
  });

  it('dispatches a created change for a new file', async () => {
    const newPath = 'workspace/.minddrop/queries/query_2.json';

    // Create a file outside of the app
    MockFileSystem.writeTextFile(newPath, '{ "id": "query_2" }');
    MockFileSystem.dispatchWatchEvent('create', [newPath]);

    await flushDebounce();

    // Should dispatch a created change
    expect(changes).toEqual([{ path: newPath, kind: 'created' }]);
  });

  it('dispatches a deleted change for a removed file', async () => {
    // Remove a file outside of the app
    MockFileSystem.removeFile(QueryPath);
    MockFileSystem.dispatchWatchEvent('remove', [QueryPath]);

    await flushDebounce();

    // Should dispatch a deleted change
    expect(changes).toEqual([{ path: QueryPath, kind: 'deleted' }]);
  });

  it('dispatches a deleted change when the adapter reports a modification of a missing file', async () => {
    // Remove a file, reported as a modification as some platforms do
    MockFileSystem.removeFile(QueryPath);
    MockFileSystem.dispatchWatchEvent('modify', [QueryPath]);

    await flushDebounce();

    // Should dispatch a deleted change, based on the path being gone
    expect(changes).toEqual([{ path: QueryPath, kind: 'deleted' }]);
  });

  it('coalesces a burst of events for the same path into one change', async () => {
    // Dispatch the several events an editor produces per save
    MockFileSystem.dispatchWatchEvent('create', [QueryPath]);
    MockFileSystem.dispatchWatchEvent('modify', [QueryPath]);
    MockFileSystem.dispatchWatchEvent('modify', [QueryPath]);

    await flushDebounce();

    // Should dispatch a single change
    expect(changes.length).toBe(1);
  });

  it('dispatches a change per path', async () => {
    const otherPath = 'workspace/.minddrop/queries/query_2.json';

    MockFileSystem.writeTextFile(otherPath, '{ "id": "query_2" }');
    MockFileSystem.dispatchWatchEvent('modify', [QueryPath, otherPath]);

    await flushDebounce();

    // Should dispatch one change for each path
    expect(changes.map((change) => change.path)).toEqual([
      QueryPath,
      otherPath,
    ]);
  });

  it('does not dispatch a change for the app own write', async () => {
    // Write the file through the app
    await Fs.writeTextFile(QueryPath, '{ "id": "query_1", "v": 2 }');
    MockFileSystem.dispatchWatchEvent('modify', [QueryPath]);

    await flushDebounce();

    // Should dispatch nothing, the app's state already being current
    expect(changes).toEqual([]);
  });

  it('dispatches a change to an app written file whose contents differ', async () => {
    // Write the file through the app, then modify it outside of the app
    await Fs.writeTextFile(QueryPath, '{ "id": "query_1", "v": 2 }');
    MockFileSystem.writeTextFile(QueryPath, '{ "id": "query_1", "v": 3 }');
    MockFileSystem.dispatchWatchEvent('modify', [QueryPath]);

    await flushDebounce();

    // Should dispatch a change, the file no longer holding what
    // the app wrote
    expect(changes).toEqual([{ path: QueryPath, kind: 'modified' }]);
  });

  it('ignores OS metadata and editor temp files', async () => {
    MockFileSystem.dispatchWatchEvent('modify', [
      'workspace/.DS_Store',
      'workspace/notes.md.tmp',
      'workspace/notes.md~',
    ]);

    await flushDebounce();

    // Should dispatch nothing
    expect(changes).toEqual([]);
  });

  it('stops dispatching changes once stopped', async () => {
    stopWatcher();

    MockFileSystem.dispatchWatchEvent('modify', [QueryPath]);

    await flushDebounce();

    // Should dispatch nothing
    expect(changes).toEqual([]);
  });
});

/**
 * Advances past the watcher's debounce window, letting the
 * promises it awaits resolve.
 */
async function flushDebounce(): Promise<void> {
  await vi.advanceTimersByTimeAsync(300);
}

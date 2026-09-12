import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FileSystemChange } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  MockBackendAdapter,
  MockFs,
  cleanup,
  createMockBackendAdapter,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../../test-utils';
import { resolveDatabaseConfigFilePath } from '../../utils';
import { onFileSystemChanged } from './file-system-changed';

const { workspace_1 } = WorkspaceFixtures;

describe('onFileSystemChanged', () => {
  // The registered mock backend's recorded call state
  let backend: MockBackendAdapter;

  beforeEach(() => {
    setup();
    vi.useFakeTimers();

    // Stand in for the platform backend, recording the scans it
    // is asked for.
    backend = createMockBackendAdapter();
  });

  afterEach(async () => {
    vi.useRealTimers();
    await cleanup();
  });

  it('scans the workspace after a change inside a database', async () => {
    await onFileSystemChanged(
      change(`${databaseDirPath(objectDatabase)}/Dune.md`),
    );

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('scans the workspace when a database directory is deleted', async () => {
    await onFileSystemChanged(
      change(databaseDirPath(objectDatabase), 'deleted'),
    );

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('coalesces a burst of changes into a single scan', async () => {
    await onFileSystemChanged(
      change(`${databaseDirPath(objectDatabase)}/Dune.md`),
    );
    await onFileSystemChanged(
      change(`${databaseDirPath(objectDatabase)}/Emma.md`),
    );
    await onFileSystemChanged(
      change(`${databaseDirPath(objectDatabase)}/Ubik.md`),
    );

    await flushDebounce();

    expect(backend.backgroundSyncCalls.length).toBe(1);
  });

  it('scans the workspace when a config file appears outside every known database', async () => {
    await onFileSystemChanged(
      change(
        resolveDatabaseConfigFilePath(`${workspace_1.path}/Unknown`),
        'created',
      ),
    );

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('scans the workspace when a directory holding a config file is created', async () => {
    const databasePath = `${workspace_1.path}/Copied`;

    // A database directory copied in whole, the platform watcher
    // reporting only the directory itself.
    MockFs.addFiles([
      { path: resolveDatabaseConfigFilePath(databasePath), textContent: '{}' },
    ]);

    await onFileSystemChanged(change(databasePath, 'created'));

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('ignores changes to app state in the workspace hidden directory', async () => {
    await onFileSystemChanged(
      change(`${workspace_1.path}/${Paths.hiddenDirName}/views/view.json`),
    );

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores changes to directories the user keeps for their own purposes', async () => {
    await onFileSystemChanged(change(`${workspace_1.path}/Scratch/notes.txt`));

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores a created directory which holds no config file', async () => {
    await onFileSystemChanged(change(`${workspace_1.path}/Scratch`, 'created'));

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([]);
  });
});

/**
 * Creates a file system change for the given path.
 */
function change(
  path: string,
  kind: FileSystemChange['kind'] = 'modified',
): FileSystemChange {
  return { path, kind };
}

/**
 * Advances past the scan debounce window.
 */
async function flushDebounce(): Promise<void> {
  await vi.advanceTimersByTimeAsync(500);
}

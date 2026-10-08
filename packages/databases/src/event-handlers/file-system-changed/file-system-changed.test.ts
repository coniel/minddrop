import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FileSystemChange } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import {
  MockBackendAdapter,
  MockFs,
  cleanup,
  createMockBackendAdapter,
  databaseDirPath,
  entryFileChange,
  objectDatabase,
  objectEntry1,
  setup,
} from '../../test-utils';
import {
  resolveDatabaseConfigFilePath,
  resolveEntryMetadataFilePath,
} from '../../utils';
import { onFileSystemChanged } from './file-system-changed';

const objectDatabasePath = databaseDirPath(objectDatabase);
const objectHiddenPath = `${objectDatabasePath}/${Paths.hiddenDirName}`;

const { workspace_1, workspace_2 } = WorkspaceFixtures;

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

  it('syncs an entry whose file changed, without scanning the workspace', async () => {
    await onFileSystemChanged(change(`${objectDatabasePath}/Dune.md`));

    await flushDebounce();

    expect(backend.syncEntryFilesCalls).toEqual([
      [entryFileChange(objectDatabase.id, 'Dune.md')],
    ]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('syncs an entry whose sidecar changed', async () => {
    await onFileSystemChanged(
      change(
        resolveEntryMetadataFilePath(objectDatabasePath, objectEntry1.path),
      ),
    );

    await flushDebounce();

    expect(backend.syncEntryFilesCalls).toEqual([
      [entryFileChange(objectDatabase.id, objectEntry1.path, 'metadata')],
    ]);
  });

  it('ignores a sidecar which no indexed entry owns', async () => {
    await onFileSystemChanged(
      change(resolveEntryMetadataFilePath(objectDatabasePath, 'Gone.md')),
    );

    await flushDebounce();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it("ignores changes to a database's views, designs and history", async () => {
    const directories = ['content-views', 'designs', 'history'].map(
      (name) => `${objectHiddenPath}/${name}`,
    );

    MockFs.addFiles(directories.map((path) => `${path}/file.json`));

    // Report each directory as created, which a database's other
    // directories are scanned for.
    for (const path of directories) {
      await onFileSystemChanged(change(path, 'created'));
    }

    await flushDebounce();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores changes to property files', async () => {
    await onFileSystemChanged(change(`${objectDatabasePath}/Cover.png`));

    await flushDebounce();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores a file created in a database which is not an entry', async () => {
    MockFs.addFiles([`${objectDatabasePath}/Cover.png`]);

    await onFileSystemChanged(
      change(`${objectDatabasePath}/Cover.png`, 'created'),
    );

    await flushDebounce();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('scans the workspace when a path without an extension is deleted from a database', async () => {
    await onFileSystemChanged(
      change(`${objectDatabasePath}/Folder`, 'deleted'),
    );

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('scans the workspace when a path without an extension is deleted from a database inside a dotted directory', async () => {
    // A database whose path has a dot in a directory name
    const dottedDatabase = {
      ...objectDatabase,
      path: `Vol.1/${objectDatabase.name}`,
    };

    DatabasesStore.in(workspace_1.id).set(dottedDatabase);

    await onFileSystemChanged(
      change(`${databaseDirPath(dottedDatabase)}/Folder`, 'deleted'),
    );

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it("scans the workspace when a database's config changes", async () => {
    await onFileSystemChanged(
      change(resolveDatabaseConfigFilePath(objectDatabasePath)),
    );

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('scans the workspace when a directory is created in a database', async () => {
    MockFs.addFiles([`${objectDatabasePath}/Folder/notes.txt`]);

    await onFileSystemChanged(
      change(`${objectDatabasePath}/Folder`, 'created'),
    );

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('scans the workspace instead when a burst changes too many entries', async () => {
    for (let index = 0; index < 51; index += 1) {
      await onFileSystemChanged(change(`${objectDatabasePath}/${index}.md`));
    }

    await flushDebounce();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls.length).toBe(1);
  });

  it('syncs a burst of as many entries as the limit one by one', async () => {
    for (let index = 0; index < 50; index += 1) {
      await onFileSystemChanged(change(`${objectDatabasePath}/${index}.md`));
    }

    await flushDebounce();

    expect(
      backend.syncEntryFilesCalls.map((changes) => changes.length),
    ).toEqual([50]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('counts repeated changes to one entry once toward the limit', async () => {
    for (let index = 0; index < 51; index += 1) {
      await onFileSystemChanged(change(`${objectDatabasePath}/Dune.md`));
    }

    await flushDebounce();

    expect(backend.syncEntryFilesCalls).toEqual([
      [entryFileChange(objectDatabase.id, 'Dune.md')],
    ]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it("runs a workspace's syncs one at a time", async () => {
    // Stand in for a backend whose syncs finish when told to
    backend = createMockBackendAdapter(undefined, { deferSyncs: true });

    await onFileSystemChanged(change(`${objectDatabasePath}/Dune.md`));
    await flushDebounce();

    // Changes arriving while the first sync runs
    await onFileSystemChanged(change(`${objectDatabasePath}/Emma.md`));
    await flushDebounce();
    await onFileSystemChanged(change(`${objectDatabasePath}/Ubik.md`));
    await flushDebounce();

    // Should not start a second sync until the first finishes
    expect(backend.syncEntryFilesCalls).toEqual([
      [entryFileChange(objectDatabase.id, 'Dune.md')],
    ]);

    backend.finishNextSync();
    await flushDebounce();

    // Should then run the queued changes as one sync
    expect(backend.syncEntryFilesCalls).toEqual([
      [entryFileChange(objectDatabase.id, 'Dune.md')],
      [
        entryFileChange(objectDatabase.id, 'Emma.md'),
        entryFileChange(objectDatabase.id, 'Ubik.md'),
      ],
    ]);

    backend.finishNextSync();
    await flushDebounce();
  });

  it('runs a scan queued behind an entry sync as a scan', async () => {
    // Stand in for a backend whose syncs finish when told to
    backend = createMockBackendAdapter(undefined, { deferSyncs: true });

    await onFileSystemChanged(change(`${objectDatabasePath}/Dune.md`));
    await flushDebounce();

    // A change needing a scan, arriving while the entry sync runs
    await onFileSystemChanged(
      change(resolveDatabaseConfigFilePath(objectDatabasePath)),
    );
    await flushDebounce();

    backend.finishNextSync();
    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);

    backend.finishNextSync();
    await flushDebounce();
  });

  it('scans the workspace when a database directory is deleted', async () => {
    await onFileSystemChanged(change(objectDatabasePath, 'deleted'));

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('coalesces a burst of changes into a single sync', async () => {
    await onFileSystemChanged(change(`${objectDatabasePath}/Dune.md`));
    await onFileSystemChanged(change(`${objectDatabasePath}/Emma.md`));
    await onFileSystemChanged(change(`${objectDatabasePath}/Ubik.md`));

    await flushDebounce();

    expect(backend.syncEntryFilesCalls).toEqual([
      [
        entryFileChange(objectDatabase.id, 'Dune.md'),
        entryFileChange(objectDatabase.id, 'Emma.md'),
        entryFileChange(objectDatabase.id, 'Ubik.md'),
      ],
    ]);
  });

  it("scans the change's workspace", async () => {
    // A config file appearing in the second workspace
    await onFileSystemChanged(
      change(
        resolveDatabaseConfigFilePath(`${workspace_2.path}/Books`),
        'created',
        workspace_2.id,
      ),
    );

    await flushDebounce();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_2.id, workspacePath: workspace_2.path },
    ]);
  });

  it('debounces syncs per workspace', async () => {
    await onFileSystemChanged(change(objectDatabasePath, 'deleted'));
    await onFileSystemChanged(
      change(
        resolveDatabaseConfigFilePath(`${workspace_2.path}/Books`),
        'created',
        workspace_2.id,
      ),
    );

    await flushDebounce();

    // Should scan each workspace once
    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
      { workspaceId: workspace_2.id, workspacePath: workspace_2.path },
    ]);
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
  workspaceId: string = workspace_1.id,
): FileSystemChange {
  return { workspaceId, path, kind };
}

/**
 * Advances past the scan debounce window.
 */
async function flushDebounce(): Promise<void> {
  await vi.advanceTimersByTimeAsync(500);
}

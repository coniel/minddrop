import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { createFileSystemChange } from '@minddrop/file-system/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseEntryTemplatesStore } from '../../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { EntriesStore } from '../../EntriesStore';
import { deleteEntry } from '../../deleteEntry';
import { loadDatabaseDesigns } from '../../loadDatabaseDesigns';
import { loadDatabaseViews } from '../../loadDatabaseViews';
import {
  MockBackendAdapter,
  MockFs,
  cleanup,
  createEntryFileChange,
  createMockBackendAdapter,
  databaseDirPath,
  entryFilePath,
  entryStorageDatabase,
  entryStorageEntry1,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  flushFileSystemChangeDebounces,
  imagePropertyName,
  objectDatabase,
  objectEntry1,
  propertyStorageDatabase,
  setup,
} from '../../test-utils';
import { DatabaseEntryTemplate, Entry } from '../../types';
import {
  resolveDatabaseConfigFilePath,
  resolveDatabaseDesignFilePath,
  resolveDatabaseViewFilePath,
  resolveEntryMetadataFilePath,
  resolveEntryTemplateConfigFilePath,
  resolveEntryTemplateDirPath,
  serializeDatabaseEntryTemplate,
} from '../../utils';
import { onFileSystemChanged } from './file-system-changed';

const { contentView_virtual_1 } = ContentViewFixtures;
const { ownedCardDesign_1 } = DesignFixtures;

const objectDatabasePath = databaseDirPath(objectDatabase);
const entryTemplatesDatabasePath = databaseDirPath(entryTemplatesDatabase);

// The view as stored in the object database's views directory
const {
  dataSource: _dataSource,
  virtual: _virtual,
  ...storedView
} = contentView_virtual_1;
const viewPath = resolveDatabaseViewFilePath(objectDatabasePath, storedView.id);

// The design as stored in the object database's designs directory
const { owner: _owner, ...storedDesign } = ownedCardDesign_1;
const designPath = resolveDatabaseDesignFilePath(
  objectDatabasePath,
  storedDesign.id,
);

// The config file of a template loaded by the setup
const templatePath = resolveEntryTemplateConfigFilePath(
  entryTemplatesDatabasePath,
  entryTemplate1.id,
);
const objectHiddenPath = `${objectDatabasePath}/${Paths.hiddenDirName}`;
const entryStorageDatabasePath = databaseDirPath(entryStorageDatabase);
const propertyStorageDatabasePath = databaseDirPath(propertyStorageDatabase);

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

  /**
   * Runs the debounced syncs and asserts that the backend synced
   * nothing.
   */
  async function expectNoSync(): Promise<void> {
    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.syncDatabaseConfigsCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  }

  it('syncs an entry whose file changed, without scanning the workspace', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Dune.md`,
        'modified',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([
      [createEntryFileChange(objectDatabase.id, 'Dune.md')],
    ]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('syncs an entry whose sidecar changed', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        resolveEntryMetadataFilePath(objectDatabasePath, objectEntry1.path),
        'modified',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([
      [createEntryFileChange(objectDatabase.id, objectEntry1.path, 'metadata')],
    ]);
  });

  it('ignores a sidecar which no indexed entry owns', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        resolveEntryMetadataFilePath(objectDatabasePath, 'Gone.md'),
        'modified',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it("does not scan a database's created views, designs and history directories", async () => {
    const directories = ['content-views', 'designs', 'history'].map(
      (name) => `${objectHiddenPath}/${name}`,
    );

    MockFs.addFiles(directories.map((path) => `${path}/file.json`));

    // Report each directory as created. Other directories in a database
    // are listed for entry files when created.
    for (const path of directories) {
      await onFileSystemChanged(
        createFileSystemChange(path, 'created', workspace_1.id),
      );
    }

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores changes to property files', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Cover.png`,
        'modified',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores a file created in a database which is not an entry', async () => {
    MockFs.addFiles([`${objectDatabasePath}/Cover.png`]);

    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Cover.png`,
        'created',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores a deleted property file directory', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${propertyStorageDatabasePath}/${imagePropertyName}`,
        'deleted',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('syncs the entries indexed under a deleted directory, without scanning the workspace', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        Fs.parentDirPath(entryFilePath(entryStorageEntry1)),
        'deleted',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([
      [createEntryFileChange(entryStorageDatabase.id, entryStorageEntry1.path)],
    ]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('syncs the entry indexed under a deleted directory whose name has a dot', async () => {
    // An entry kept in a directory whose name has a dot
    const dottedEntry: Entry = {
      ...entryStorageEntry1,
      id: 'database-entry_dotted',
      path: 'Vol. 1/Vol. 1.md',
    };

    EntriesStore.in(workspace_1.id).set(dottedEntry);

    await onFileSystemChanged(
      createFileSystemChange(
        `${entryStorageDatabasePath}/Vol. 1`,
        'deleted',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([
      [createEntryFileChange(entryStorageDatabase.id, dottedEntry.path)],
    ]);
  });

  it('syncs a database whose config changed, without scanning the workspace', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        resolveDatabaseConfigFilePath(objectDatabasePath),
        'modified',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncDatabaseConfigsCalls).toEqual([[objectDatabase.id]]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it("scans the workspace when a database's hidden directory is deleted", async () => {
    await onFileSystemChanged(
      createFileSystemChange(objectHiddenPath, 'deleted', workspace_1.id),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncDatabaseConfigsCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('syncs the entry changes of a burst before its config changes', async () => {
    // Stand in for a backend whose syncs finish when told to
    backend = createMockBackendAdapter({ deferSyncs: true });

    await onFileSystemChanged(
      createFileSystemChange(
        resolveDatabaseConfigFilePath(objectDatabasePath),
        'modified',
        workspace_1.id,
      ),
    );
    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Dune.md`,
        'modified',
        workspace_1.id,
      ),
    );
    await flushFileSystemChangeDebounces();

    // Should sync the entries first. The config sync should wait.
    expect(backend.syncEntryFilesCalls).toEqual([
      [createEntryFileChange(objectDatabase.id, 'Dune.md')],
    ]);
    expect(backend.syncDatabaseConfigsCalls).toEqual([]);

    backend.finishNextSync();
    await flushFileSystemChangeDebounces();

    // Should then sync the config
    expect(backend.syncDatabaseConfigsCalls).toEqual([[objectDatabase.id]]);
    expect(backend.backgroundSyncCalls).toEqual([]);

    backend.finishNextSync();
    await flushFileSystemChangeDebounces();
  });

  it('merges config changes queued behind a sync into one config sync', async () => {
    // Stand in for a backend whose syncs finish when told to
    backend = createMockBackendAdapter({ deferSyncs: true });

    await onFileSystemChanged(
      createFileSystemChange(
        resolveDatabaseConfigFilePath(objectDatabasePath),
        'modified',
        workspace_1.id,
      ),
    );
    await flushFileSystemChangeDebounces();

    // Report config changes while the first sync runs. One database's
    // config changes twice.
    await onFileSystemChanged(
      createFileSystemChange(
        resolveDatabaseConfigFilePath(objectDatabasePath),
        'modified',
        workspace_1.id,
      ),
    );
    await flushFileSystemChangeDebounces();
    await onFileSystemChanged(
      createFileSystemChange(
        resolveDatabaseConfigFilePath(entryStorageDatabasePath),
        'modified',
        workspace_1.id,
      ),
    );
    await flushFileSystemChangeDebounces();
    await onFileSystemChanged(
      createFileSystemChange(
        resolveDatabaseConfigFilePath(objectDatabasePath),
        'modified',
        workspace_1.id,
      ),
    );
    await flushFileSystemChangeDebounces();

    // Should not start a second sync until the first finishes
    expect(backend.syncDatabaseConfigsCalls).toEqual([[objectDatabase.id]]);

    backend.finishNextSync();
    await flushFileSystemChangeDebounces();

    // Should then sync the queued configs as one sync, each database
    // once.
    expect(backend.syncDatabaseConfigsCalls).toEqual([
      [objectDatabase.id],
      [objectDatabase.id, entryStorageDatabase.id],
    ]);

    backend.finishNextSync();
    await flushFileSystemChangeDebounces();
  });

  it('ignores a created property file directory', async () => {
    const dirPath = `${propertyStorageDatabasePath}/${imagePropertyName}`;

    MockFs.addFiles([`${dirPath}/cover.png`]);

    await onFileSystemChanged(
      createFileSystemChange(dirPath, 'created', workspace_1.id),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('syncs the entry in a created entry directory, without scanning the workspace', async () => {
    const dirPath = `${entryStorageDatabasePath}/Copied`;

    // Copy in an entry kept in its own directory. The platform watcher
    // reports only the directory itself.
    MockFs.addFiles([`${dirPath}/Copied.md`, `${dirPath}/image.png`]);

    await onFileSystemChanged(
      createFileSystemChange(dirPath, 'created', workspace_1.id),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([
      [createEntryFileChange(entryStorageDatabase.id, 'Copied/Copied.md')],
    ]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores a created directory in a database which keeps its entries at its root', async () => {
    const dirPath = `${objectDatabasePath}/Folder`;

    MockFs.addFiles([`${dirPath}/Notes.md`]);

    await onFileSystemChanged(
      createFileSystemChange(dirPath, 'created', workspace_1.id),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores a created directory which is gone before it is checked', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${entryStorageDatabasePath}/Gone`,
        'created',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('scans the workspace instead when a burst changes too many entries', async () => {
    for (let index = 0; index < 51; index += 1) {
      await onFileSystemChanged(
        createFileSystemChange(
          `${objectDatabasePath}/${index}.md`,
          'modified',
          workspace_1.id,
        ),
      );
    }

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls.length).toBe(1);
  });

  it('syncs a burst of as many entries as the limit one by one', async () => {
    for (let index = 0; index < 50; index += 1) {
      await onFileSystemChanged(
        createFileSystemChange(
          `${objectDatabasePath}/${index}.md`,
          'modified',
          workspace_1.id,
        ),
      );
    }

    await flushFileSystemChangeDebounces();

    expect(
      backend.syncEntryFilesCalls.map((changes) => changes.length),
    ).toEqual([50]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('counts repeated changes to one entry once toward the limit', async () => {
    for (let index = 0; index < 51; index += 1) {
      await onFileSystemChanged(
        createFileSystemChange(
          `${objectDatabasePath}/Dune.md`,
          'modified',
          workspace_1.id,
        ),
      );
    }

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([
      [createEntryFileChange(objectDatabase.id, 'Dune.md')],
    ]);
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('scans the workspace instead when a deleted directory holds too many entries', async () => {
    // Index more entries under one directory than the limit
    for (let index = 0; index < 51; index += 1) {
      EntriesStore.in(workspace_1.id).set({
        ...entryStorageEntry1,
        id: `database-entry_batch_${index}`,
        path: `Batch/${index}/${index}.md`,
      });
    }

    await onFileSystemChanged(
      createFileSystemChange(
        `${entryStorageDatabasePath}/Batch`,
        'deleted',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([]);
    expect(backend.backgroundSyncCalls.length).toBe(1);
  });

  it('runs a config change merged with a scan as the scan alone', async () => {
    await onFileSystemChanged(
      createFileSystemChange(objectDatabasePath, 'deleted', workspace_1.id),
    );
    await onFileSystemChanged(
      createFileSystemChange(
        resolveDatabaseConfigFilePath(entryStorageDatabasePath),
        'modified',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncDatabaseConfigsCalls).toEqual([]);
    expect(backend.backgroundSyncCalls.length).toBe(1);
  });

  it("runs a workspace's syncs one at a time", async () => {
    // Stand in for a backend whose syncs finish when told to
    backend = createMockBackendAdapter({ deferSyncs: true });

    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Dune.md`,
        'modified',
        workspace_1.id,
      ),
    );
    await flushFileSystemChangeDebounces();

    // Changes arriving while the first sync runs
    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Emma.md`,
        'modified',
        workspace_1.id,
      ),
    );
    await flushFileSystemChangeDebounces();
    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Ubik.md`,
        'modified',
        workspace_1.id,
      ),
    );
    await flushFileSystemChangeDebounces();

    // Should not start a second sync until the first finishes
    expect(backend.syncEntryFilesCalls).toEqual([
      [createEntryFileChange(objectDatabase.id, 'Dune.md')],
    ]);

    backend.finishNextSync();
    await flushFileSystemChangeDebounces();

    // Should then run the queued changes as one sync
    expect(backend.syncEntryFilesCalls).toEqual([
      [createEntryFileChange(objectDatabase.id, 'Dune.md')],
      [
        createEntryFileChange(objectDatabase.id, 'Emma.md'),
        createEntryFileChange(objectDatabase.id, 'Ubik.md'),
      ],
    ]);

    backend.finishNextSync();
    await flushFileSystemChangeDebounces();
  });

  it('runs a scan queued behind an entry sync as a scan', async () => {
    // Stand in for a backend whose syncs finish when told to
    backend = createMockBackendAdapter({ deferSyncs: true });

    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Dune.md`,
        'modified',
        workspace_1.id,
      ),
    );
    await flushFileSystemChangeDebounces();

    // A change needing a scan, arriving while the entry sync runs
    await onFileSystemChanged(
      createFileSystemChange(objectDatabasePath, 'deleted', workspace_1.id),
    );
    await flushFileSystemChangeDebounces();

    backend.finishNextSync();
    await flushFileSystemChangeDebounces();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);

    backend.finishNextSync();
    await flushFileSystemChangeDebounces();
  });

  it('scans the workspace when a database directory is deleted', async () => {
    await onFileSystemChanged(
      createFileSystemChange(objectDatabasePath, 'deleted', workspace_1.id),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('coalesces a burst of changes into a single sync', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Dune.md`,
        'modified',
        workspace_1.id,
      ),
    );
    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Emma.md`,
        'modified',
        workspace_1.id,
      ),
    );
    await onFileSystemChanged(
      createFileSystemChange(
        `${objectDatabasePath}/Ubik.md`,
        'modified',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.syncEntryFilesCalls).toEqual([
      [
        createEntryFileChange(objectDatabase.id, 'Dune.md'),
        createEntryFileChange(objectDatabase.id, 'Emma.md'),
        createEntryFileChange(objectDatabase.id, 'Ubik.md'),
      ],
    ]);
  });

  it("scans the change's workspace", async () => {
    // A config file appearing in the second workspace
    await onFileSystemChanged(
      createFileSystemChange(
        resolveDatabaseConfigFilePath(`${workspace_2.path}/Books`),
        'created',
        workspace_2.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_2.id, workspacePath: workspace_2.path },
    ]);
  });

  it('debounces syncs per workspace', async () => {
    await onFileSystemChanged(
      createFileSystemChange(objectDatabasePath, 'deleted', workspace_1.id),
    );
    await onFileSystemChanged(
      createFileSystemChange(
        resolveDatabaseConfigFilePath(`${workspace_2.path}/Books`),
        'created',
        workspace_2.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    // Should scan each workspace once
    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
      { workspaceId: workspace_2.id, workspacePath: workspace_2.path },
    ]);
  });

  it('scans the workspace when a config file appears outside every known database', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        resolveDatabaseConfigFilePath(`${workspace_1.path}/Unknown`),
        'created',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('scans the workspace when a directory holding a config file is created', async () => {
    const databasePath = `${workspace_1.path}/Copied`;

    // Copy in a whole database directory. The platform watcher reports
    // only the directory itself.
    MockFs.addFiles([
      { path: resolveDatabaseConfigFilePath(databasePath), textContent: '{}' },
    ]);

    await onFileSystemChanged(
      createFileSystemChange(databasePath, 'created', workspace_1.id),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('ignores changes to app state in the workspace hidden directory', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${workspace_1.path}/${Paths.hiddenDirName}/views/view.json`,
        'modified',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores changes to directories the user keeps for their own purposes', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${workspace_1.path}/Scratch/notes.txt`,
        'modified',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('ignores a created directory which holds no config file', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${workspace_1.path}/Scratch`,
        'created',
        workspace_1.id,
      ),
    );

    await flushFileSystemChangeDebounces();

    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('reloads a database view whose file changed outside the app', async () => {
    // Apply changes through the registered listeners, as the app does
    ContentViews.initialize();
    Events.on(Fs.events.Changed, 'databases', onFileSystemChanged);

    // Add the view file and load the database's views
    MockFs.addFiles([
      { path: viewPath, textContent: JSON.stringify(storedView) },
    ]);
    await loadDatabaseViews([objectDatabase], workspace_1);

    // Rename the view on disk and report the change, as a sync from
    // another device does.
    MockFs.writeTextFile(
      viewPath,
      JSON.stringify({ ...storedView, name: 'Renamed elsewhere' }),
    );
    Events.dispatch(
      Fs.events.Changed,
      createFileSystemChange(viewPath, 'modified', workspace_1.id),
    );

    await flushFileSystemChangeDebounces();

    // Expect the store to have the renamed view. A stale view would
    // overwrite the file on the next in-app edit.
    expect(storeItem(ContentViews.Store, storedView.id).name).toBe(
      'Renamed elsewhere',
    );
    await expectNoSync();
  });

  it('reloads a database design whose file changed outside the app', async () => {
    // Apply changes through the registered listeners, as the app does
    Events.on(Fs.events.Changed, 'databases', onFileSystemChanged);

    // Add the design file and load the database's designs
    MockFs.addFiles([
      { path: designPath, textContent: JSON.stringify(storedDesign) },
    ]);
    await loadDatabaseDesigns([objectDatabase], workspace_1);

    // Rename the design on disk and report the change, as a sync from
    // another device does.
    MockFs.writeTextFile(
      designPath,
      JSON.stringify({ ...storedDesign, name: 'Renamed elsewhere' }),
    );
    Events.dispatch(
      Fs.events.Changed,
      createFileSystemChange(designPath, 'modified', workspace_1.id),
    );

    await flushFileSystemChangeDebounces();

    // Expect the store to have the renamed design. A stale design would
    // overwrite the file on the next in-app edit.
    expect(storeItem(Designs.Store, storedDesign.id).name).toBe(
      'Renamed elsewhere',
    );
    await expectNoSync();
  });

  it('reloads an entry template whose config file changed outside the app', async () => {
    // Rename the template on disk
    MockFs.writeTextFile(
      templatePath,
      JSON.stringify({
        ...serializeDatabaseEntryTemplate(entryTemplate1),
        name: 'Renamed elsewhere',
      }),
    );

    await onFileSystemChanged(
      createFileSystemChange(templatePath, 'modified', workspace_1.id),
    );

    await flushFileSystemChangeDebounces();

    expect(DatabaseEntryTemplatesStore).toHaveItem(entryTemplate1.id, {
      ...entryTemplate1,
      name: 'Renamed elsewhere',
    });
    await expectNoSync();
  });

  it("adds a created database view to the store and the database's view list", async () => {
    // Create the view file outside of the app
    MockFs.addFiles([
      { path: viewPath, textContent: JSON.stringify(storedView) },
    ]);

    await onFileSystemChanged(
      createFileSystemChange(viewPath, 'created', workspace_1.id),
    );

    expect(storeItem(ContentViews.Store, storedView.id).owner).toBe(
      objectDatabase.id,
    );
    expect(storeItem(DatabasesStore, objectDatabase.id).views).toEqual([
      storedView.id,
    ]);
    await expectNoSync();
  });

  it("adds a created database design to the store and the database's design list", async () => {
    // Create the design file outside of the app
    MockFs.addFiles([
      { path: designPath, textContent: JSON.stringify(storedDesign) },
    ]);

    await onFileSystemChanged(
      createFileSystemChange(designPath, 'created', workspace_1.id),
    );

    expect(Designs.Store).toHaveItem(storedDesign.id, {
      ...storedDesign,
      owner: objectDatabase.id,
    });
    expect(storeItem(DatabasesStore, objectDatabase.id).designs).toEqual([
      storedDesign.id,
    ]);
    await expectNoSync();
  });

  it("adds a created entry template to the store and the database's template list", async () => {
    // The created template, in another directory of the database
    const created: DatabaseEntryTemplate = {
      ...entryTemplate2,
      id: 'database-entry-template_9',
    };
    // Resolve the created template's directory
    const createdDirPath = resolveEntryTemplateDirPath(
      entryTemplatesDatabasePath,
      created.id,
    );

    // Copy the template's directory in outside of the app
    MockFs.addFiles([
      {
        path: resolveEntryTemplateConfigFilePath(
          entryTemplatesDatabasePath,
          created.id,
        ),
        textContent: JSON.stringify(serializeDatabaseEntryTemplate(created)),
      },
    ]);

    // Report the directory alone, as a platform watcher may
    await onFileSystemChanged(
      createFileSystemChange(createdDirPath, 'created', workspace_1.id),
    );

    expect(DatabaseEntryTemplatesStore).toHaveItem(created.id, created);
    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate1.id, entryTemplate2.id, created.id]);
    await expectNoSync();
  });

  it("removes a deleted database view from the store and the database's view list", async () => {
    // Add the view file and load the database's views
    MockFs.addFiles([
      { path: viewPath, textContent: JSON.stringify(storedView) },
    ]);
    await loadDatabaseViews([objectDatabase], workspace_1);

    // Delete the view file outside of the app
    MockFs.removeFile(viewPath);

    await onFileSystemChanged(
      createFileSystemChange(viewPath, 'deleted', workspace_1.id),
    );

    expect(ContentViews.Store).not.toHaveItem(storedView.id);
    expect(storeItem(DatabasesStore, objectDatabase.id).views).toEqual([]);
    await expectNoSync();
  });

  it("removes a deleted database design from the store and the database's design list", async () => {
    // Add the design file and load the database's designs
    MockFs.addFiles([
      { path: designPath, textContent: JSON.stringify(storedDesign) },
    ]);
    await loadDatabaseDesigns([objectDatabase], workspace_1);

    // Delete the design file outside of the app
    MockFs.removeFile(designPath);

    await onFileSystemChanged(
      createFileSystemChange(designPath, 'deleted', workspace_1.id),
    );

    expect(Designs.Store).not.toHaveItem(storedDesign.id);
    expect(storeItem(DatabasesStore, objectDatabase.id).designs).toEqual([]);
    await expectNoSync();
  });

  it("removes a deleted entry template from the store and the database's template list", async () => {
    // Resolve the template's directory
    const templateDirPath = resolveEntryTemplateDirPath(
      entryTemplatesDatabasePath,
      entryTemplate1.id,
    );

    // Delete the template's directory outside of the app
    MockFs.removeDir(templateDirPath, { recursive: true });

    // Report the directory alone, as a platform watcher may
    await onFileSystemChanged(
      createFileSystemChange(templateDirPath, 'deleted', workspace_1.id),
    );

    expect(DatabaseEntryTemplatesStore).not.toHaveItem(entryTemplate1.id);
    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate2.id]);
    await expectNoSync();
  });

  it('leaves a database view as it is when its file cannot be parsed', async () => {
    // Add the view file and load the database's views
    MockFs.addFiles([
      { path: viewPath, textContent: JSON.stringify(storedView) },
    ]);
    await loadDatabaseViews([objectDatabase], workspace_1);

    // Make the view file unparseable outside of the app
    MockFs.writeTextFile(viewPath, 'not json');

    await onFileSystemChanged(
      createFileSystemChange(viewPath, 'modified', workspace_1.id),
    );

    expect(storeItem(ContentViews.Store, storedView.id).name).toBe(
      storedView.name,
    );
    expect(storeItem(DatabasesStore, objectDatabase.id).views).toEqual([
      storedView.id,
    ]);
    await expectNoSync();
  });

  it('leaves a database design as it is when its file cannot be parsed', async () => {
    // Add the design file and load the database's designs
    MockFs.addFiles([
      { path: designPath, textContent: JSON.stringify(storedDesign) },
    ]);
    await loadDatabaseDesigns([objectDatabase], workspace_1);

    // Make the design file unparseable outside of the app
    MockFs.writeTextFile(designPath, 'not json');

    await onFileSystemChanged(
      createFileSystemChange(designPath, 'modified', workspace_1.id),
    );

    expect(Designs.Store).toHaveItem(storedDesign.id, {
      ...storedDesign,
      owner: objectDatabase.id,
    });
    expect(storeItem(DatabasesStore, objectDatabase.id).designs).toEqual([
      storedDesign.id,
    ]);
    await expectNoSync();
  });

  it('leaves an entry template as it is when its config file cannot be parsed', async () => {
    // Make the template's config file unparseable outside of the app
    MockFs.writeTextFile(templatePath, 'not json');

    await onFileSystemChanged(
      createFileSystemChange(templatePath, 'modified', workspace_1.id),
    );

    expect(DatabaseEntryTemplatesStore).toHaveItem(
      entryTemplate1.id,
      entryTemplate1,
    );
    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate1.id, entryTemplate2.id]);
    await expectNoSync();
  });

  it('does not scan the workspace when the app deletes an entry kept in its own directory', async () => {
    // Report changes through the watcher, as the app does
    Events.on(Fs.events.Changed, 'databases', onFileSystemChanged);

    // Start the file system watcher
    const stopWatcher = await Fs.startWatcher([
      { workspaceId: workspace_1.id, path: workspace_1.path },
    ]);

    try {
      // Delete an entry stored in a directory of its own. This trashes
      // the directory.
      await deleteEntry(entryStorageEntry1.id);

      // Report the trashed directory through the platform watcher
      MockFs.dispatchWatchEvent('remove', [
        Fs.parentDirPath(entryFilePath(entryStorageEntry1)),
      ]);

      await flushFileSystemChangeDebounces();

      expect(backend.backgroundSyncCalls).toEqual([]);
    } finally {
      stopWatcher();
    }
  });
});

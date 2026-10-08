import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { loadDatabaseViews } from '../loadDatabaseViews';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseViewFilePath } from '../utils';
import { reloadDatabaseView } from './reloadDatabaseView';

const { contentView_virtual_1 } = ContentViewFixtures;
const { workspace_1 } = WorkspaceFixtures;

// The view as stored in the database's views directory
const {
  dataSource: _dataSource,
  virtual: _virtual,
  ...storedView
} = contentView_virtual_1;
const viewPath = resolveDatabaseViewFilePath(
  databaseDirPath(objectDatabase),
  storedView.id,
);

describe('reloadDatabaseView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("loads a new view into the store and the database's view list", async () => {
    MockFs.addFiles([
      { path: viewPath, textContent: JSON.stringify(storedView) },
    ]);

    await reloadDatabaseView(objectDatabase, storedView.id, workspace_1);

    expect(storeItem(ContentViews.Store, storedView.id).owner).toBe(
      objectDatabase.id,
    );
    expect(storeItem(DatabasesStore, objectDatabase.id).views).toEqual([
      storedView.id,
    ]);
  });

  it('updates a loaded view with its file', async () => {
    // Load the view, then rename it on disk
    MockFs.addFiles([
      { path: viewPath, textContent: JSON.stringify(storedView) },
    ]);
    await loadDatabaseViews([objectDatabase], workspace_1);
    MockFs.writeTextFile(
      viewPath,
      JSON.stringify({ ...storedView, name: 'Renamed' }),
    );

    await reloadDatabaseView(objectDatabase, storedView.id, workspace_1);

    expect(storeItem(ContentViews.Store, storedView.id).name).toBe('Renamed');
  });

  it("removes a view whose file is gone from the store and the database's view list", async () => {
    // Load the view, then delete its file
    MockFs.addFiles([
      { path: viewPath, textContent: JSON.stringify(storedView) },
    ]);
    await loadDatabaseViews([objectDatabase], workspace_1);
    MockFs.removeFile(viewPath);

    await reloadDatabaseView(objectDatabase, storedView.id, workspace_1);

    expect(ContentViews.Store).not.toHaveItem(storedView.id);
    expect(storeItem(DatabasesStore, objectDatabase.id).views).toEqual([]);
  });

  it('leaves a loaded view as it is when its file cannot be parsed', async () => {
    // Load the view, then break its file
    MockFs.addFiles([
      { path: viewPath, textContent: JSON.stringify(storedView) },
    ]);
    await loadDatabaseViews([objectDatabase], workspace_1);
    MockFs.writeTextFile(viewPath, 'not json');

    await reloadDatabaseView(objectDatabase, storedView.id, workspace_1);

    expect(storeItem(ContentViews.Store, storedView.id).name).toBe(
      storedView.name,
    );
    expect(storeItem(DatabasesStore, objectDatabase.id).views).toEqual([
      storedView.id,
    ]);
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseViewFilePath } from '../utils';
import { readDatabaseView } from './readDatabaseView';

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

describe('readDatabaseView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the view with the database as its data source and owner', async () => {
    MockFs.addFiles([
      { path: viewPath, textContent: JSON.stringify(storedView) },
    ]);

    const view = await readDatabaseView(
      viewPath,
      objectDatabase.id,
      workspace_1.id,
    );

    expect(view).toEqual({
      status: 'read',
      value: {
        ...storedView,
        dataSource: { type: 'database', id: objectDatabase.id },
        owner: objectDatabase.id,
      },
    });
  });

  it('reports a file which cannot be parsed as unreadable', async () => {
    MockFs.addFiles([{ path: viewPath, textContent: 'not json' }]);

    expect(
      await readDatabaseView(viewPath, objectDatabase.id, workspace_1.id),
    ).toEqual({ status: 'unreadable' });
  });

  it('reports a JSON file which is not a view as unreadable', async () => {
    MockFs.addFiles([{ path: viewPath, textContent: '{}' }]);

    expect(
      await readDatabaseView(viewPath, objectDatabase.id, workspace_1.id),
    ).toEqual({ status: 'unreadable' });
  });

  it('reports a missing file as missing', async () => {
    expect(
      await readDatabaseView(viewPath, objectDatabase.id, workspace_1.id),
    ).toEqual({ status: 'missing' });
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';
import { getDatabase } from '../getDatabase';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseConfigFilePath } from '../utils';
import { normalizeDatabaseConfigIds } from './normalizeDatabaseConfigIds';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

// Path to the database's config file
const configPath = resolveDatabaseConfigFilePath(
  databaseDirPath(objectDatabase),
);

describe('normalizeDatabaseConfigIds', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reconciles the config list against the found items', () => {
    // Seed a list with a stale ID
    DatabasesStore.update(objectDatabase.id, { views: ['stale', 'kept'] });

    normalizeDatabaseConfigIds(
      objectDatabase.id,
      'views',
      [
        { id: 'new', created: new Date('2024-01-01T00:00:00.000Z') },
        { id: 'kept', created: new Date('2024-01-01T00:00:00.000Z') },
      ],
      workspace_1.id,
    );

    // The stale ID should be dropped and the new one appended
    expect(getDatabase(objectDatabase.id).views).toEqual(['kept', 'new']);
  });

  it("normalizes the config in the workspace's store record", () => {
    // The database as held by the second workspace
    DatabasesStore.in(workspace_2.id).load([
      { ...objectDatabase, views: ['stale'] },
    ]);

    normalizeDatabaseConfigIds(
      objectDatabase.id,
      'views',
      [{ id: 'new', created: new Date('2024-01-01T00:00:00.000Z') }],
      workspace_2.id,
    );

    // Should update the second workspace's record, not the
    // active workspace's.
    expect(
      DatabasesStore.in(workspace_2.id).get(objectDatabase.id)?.views,
    ).toEqual(['new']);
    expect(getDatabase(objectDatabase.id).views).toEqual(objectDatabase.views);
  });

  it('appends missing items sorted by creation date, oldest first', () => {
    normalizeDatabaseConfigIds(
      objectDatabase.id,
      'views',
      [
        { id: 'newer', created: new Date('2024-01-02T00:00:00.000Z') },
        { id: 'older', created: new Date('2024-01-01T00:00:00.000Z') },
      ],
      workspace_1.id,
    );

    expect(getDatabase(objectDatabase.id).views).toEqual(['older', 'newer']);
  });

  it('never writes the config file', () => {
    // Remove the config file so a write would be detectable. The
    // found items may be mid-sync, so a write here would conflict
    // with the incoming config.
    MockFs.removeFile(configPath);

    normalizeDatabaseConfigIds(
      objectDatabase.id,
      'views',
      [{ id: 'new', created: new Date('2024-01-01T00:00:00.000Z') }],
      workspace_1.id,
    );

    // The reconciled list should only exist in the store
    expect(MockFs.exists(configPath)).toBe(false);
    expect(getDatabase(objectDatabase.id).views).toEqual(['new']);
  });

  it('throws when the database does not exist', () => {
    expect(() =>
      normalizeDatabaseConfigIds(
        'database_missing',
        'views',
        [{ id: 'view', created: new Date('2024-01-01T00:00:00.000Z') }],
        workspace_1.id,
      ),
    ).toThrow(DatabaseNotFoundError);
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import type { Database } from '../types';
import { resolveDatabaseDesignFilePath, resolveDatabasePath } from '../utils';
import { loadDatabaseDesigns } from './loadDatabaseDesigns';

const { ownedCardDesign_1, ownedListDesign_1 } = DesignFixtures;

// The designs as stored in design files, without their owner
const { owner: _cardOwner, ...storedCardDesign } = ownedCardDesign_1;
const { owner: _listOwner, ...storedListDesign } = ownedListDesign_1;

const { workspace_1 } = WorkspaceFixtures;

describe('loadDatabaseDesigns', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads database designs into the designs store with the database as owner', async () => {
    // Add a stored design file to the database's designs directory
    MockFs.addFiles([
      {
        path: resolveDatabaseDesignFilePath(
          databaseDirPath(objectDatabase),
          storedCardDesign.id,
        ),
        textContent: JSON.stringify(storedCardDesign),
      },
    ]);

    await loadDatabaseDesigns([objectDatabase], workspace_1);

    expect(Designs.get(ownedCardDesign_1.id)).toEqual({
      ...storedCardDesign,
      owner: objectDatabase.id,
    });
  });

  it('does nothing when databases have no designs', async () => {
    await loadDatabaseDesigns([objectDatabase], workspace_1);

    expect(Designs.Store).toHaveItemCount(0);
  });

  it('loads designs from multiple databases', async () => {
    const database1: Database = {
      ...objectDatabase,
      id: 'database_1',
      path: `${objectDatabase.path}-1`,
    };
    const database2: Database = {
      ...objectDatabase,
      id: 'database_2',
      path: `${objectDatabase.path}-2`,
    };

    // Load the databases into the store
    DatabasesStore.load([database1, database2]);

    // Add a stored design file to each database's designs directory
    MockFs.addFiles([
      {
        path: resolveDatabaseDesignFilePath(
          resolveDatabasePath(database1),
          storedCardDesign.id,
        ),
        textContent: JSON.stringify(storedCardDesign),
      },
      {
        path: resolveDatabaseDesignFilePath(
          resolveDatabasePath(database2),
          storedListDesign.id,
        ),
        textContent: JSON.stringify(storedListDesign),
      },
    ]);

    await loadDatabaseDesigns([database1, database2], workspace_1);

    expect(Designs.getByOwner('database_1')).toHaveLength(1);
    expect(Designs.getByOwner('database_2')).toHaveLength(1);
  });
});

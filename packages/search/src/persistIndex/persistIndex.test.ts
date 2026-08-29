import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import {
  MockFs,
  cleanup,
  seedDatabase,
  seedEntries,
  setup,
} from '../test-utils';
import { resolveIndexPath } from '../utils';
import { persistIndex } from './persistIndex';

const workspaceId = 'workspace-1';

describe('persistIndex', () => {
  beforeEach(async () => {
    setup();

    // Seed a database with an entry and build the index
    seedDatabase({ id: 'database-1', name: 'Books' });
    seedEntries('database-1', [{ id: 'entry-1', title: 'Dune' }]);

    await rebuildSearchIndex(workspaceId);

    // Drop the index file written by the rebuild
    MockFs.reset();
  });

  afterEach(cleanup);

  it('does nothing when the workspace has no index', async () => {
    await persistIndex('other-workspace');

    expect(MockFs.exists(resolveIndexPath('other-workspace'))).toBe(false);
  });

  it('writes the serialized index to the workspace index path', async () => {
    await persistIndex(workspaceId);

    expect(MockFs.exists(resolveIndexPath(workspaceId))).toBe(true);
  });

  it('stores the current SQL version alongside the index', async () => {
    await persistIndex(workspaceId);

    // Parse the persisted payload
    const raw = MockFs.readTextFile(resolveIndexPath(workspaceId));
    const persisted = JSON.parse(raw) as { version: number; index: object };

    expect(persisted.version).toBe(Databases.sql.getVersion());
    expect(persisted.index).toBeDefined();
  });
});

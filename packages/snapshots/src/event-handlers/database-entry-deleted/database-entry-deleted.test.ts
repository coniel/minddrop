import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { recordRename } from '../../recordRename';
import { cleanup, setup } from '../../test-utils';
import { readRenameEvents } from '../../utils';
import { onDatabaseEntryDeleted } from './database-entry-deleted';

const { objectDatabase, objectEntry1 } = DatabaseFixtures;

describe('onDatabaseEntryDeleted', () => {
  beforeEach(() => {
    setup();

    // Load the entry's database so its name can be resolved
    Databases.Store.load([objectDatabase]);
  });

  afterEach(() => {
    cleanup();
    Databases.Store.clear();
  });

  it('retracts the rename chain ending at a deleted untitled entry', async () => {
    // Record a rename ending at the untitled address, as clearing
    // the entry's title would
    await recordRename({
      from: 'Objects/Test Entry',
      to: 'Objects/Untitled',
      kind: 'entry',
    });

    // Delete the entry while it is untitled
    await onDatabaseEntryDeleted({ ...objectEntry1, title: 'Untitled' });

    // The dead chain's terminal event should be gone
    expect(await readRenameEvents()).toEqual([]);
  });

  it('leaves the ledger untouched when deleting titled entries', async () => {
    // Record a rename ending at the entry's address
    await recordRename({
      from: 'Objects/Old Title',
      to: 'Objects/Test Entry',
      kind: 'entry',
    });

    // Delete the entry under its regular title
    await onDatabaseEntryDeleted(objectEntry1);

    // The chain should remain intact
    expect(await readRenameEvents()).toEqual([
      expect.objectContaining({ to: 'Objects/Test Entry' }),
    ]);
  });
});

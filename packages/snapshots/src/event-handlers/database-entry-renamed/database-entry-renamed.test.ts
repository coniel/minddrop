import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { recordRename } from '../../recordRename';
import { cleanup, setup } from '../../test-utils';
import { readRenameEvents } from '../../utils';
import { onDatabaseEntryRenamed } from './database-entry-renamed';

const { objectDatabase, objectEntry1 } = DatabaseFixtures;

describe('onDatabaseEntryRenamed', () => {
  beforeEach(() => {
    setup();

    // Load the entry's database so its name can be resolved
    Databases.Store.load([objectDatabase]);
  });

  afterEach(() => {
    cleanup();
    Databases.Store.clear();
  });

  it('records the rename in the rename ledger', async () => {
    await onDatabaseEntryRenamed({
      original: objectEntry1,
      updated: { ...objectEntry1, title: 'Renamed' },
    });

    // The ledger should contain an entry rename event recording the
    // entry's database name and titles
    expect(await readRenameEvents()).toEqual([
      expect.objectContaining({
        from: 'Objects/Test Entry',
        to: 'Objects/Renamed',
        kind: 'entry',
      }),
    ]);
  });

  it('does not record renames away from an untitled title', async () => {
    await onDatabaseEntryRenamed({
      original: { ...objectEntry1, title: 'Untitled' },
      updated: { ...objectEntry1, title: 'Renamed' },
    });

    // The rename should not appear in the ledger
    expect(await readRenameEvents()).toEqual([]);
  });

  it('records renames away from an untitled title which continue a chain', async () => {
    // Record a rename ending at the untitled address, as clearing
    // the entry's title would
    await recordRename({
      from: 'Objects/Test Entry',
      to: 'Objects/Untitled',
      kind: 'entry',
    });

    await onDatabaseEntryRenamed({
      original: { ...objectEntry1, title: 'Untitled' },
      updated: { ...objectEntry1, title: 'Renamed' },
    });

    // The rename should continue the recorded chain
    expect(await readRenameEvents()).toEqual([
      expect.objectContaining({ to: 'Objects/Untitled' }),
      expect.objectContaining({
        from: 'Objects/Untitled',
        to: 'Objects/Renamed',
        kind: 'entry',
      }),
    ]);
  });
});

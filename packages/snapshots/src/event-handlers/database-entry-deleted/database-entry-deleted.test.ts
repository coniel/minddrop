import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { recordRename } from '../../recordRename';
import { MockFs, cleanup, setup } from '../../test-utils';
import { readRenameEvents } from '../../utils';
import { onDatabaseEntryDeleted } from './database-entry-deleted';

const { objectDatabase, objectEntry1 } = DatabaseFixtures;

const historyDirPath = `${objectDatabase.path}/.minddrop/history`;

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

  it('deletes the history of a deleted untitled entry', async () => {
    MockFs.addFiles([
      `${historyDirPath}/Untitled/2026-05-01T000000Z/Untitled.md`,
    ]);

    await onDatabaseEntryDeleted({ ...objectEntry1, title: 'Untitled' });

    // The next untitled entry takes the freed title, so it must not
    // find this entry's history under it
    expect(MockFs.exists(`${historyDirPath}/Untitled`)).toBe(false);
  });

  it('keeps the history of a deleted titled entry', async () => {
    MockFs.addFiles([
      `${historyDirPath}/Test Entry/2026-05-01T000000Z/Test Entry.md`,
    ]);

    await onDatabaseEntryDeleted(objectEntry1);

    expect(MockFs.exists(`${historyDirPath}/Test Entry`)).toBe(true);
  });
});

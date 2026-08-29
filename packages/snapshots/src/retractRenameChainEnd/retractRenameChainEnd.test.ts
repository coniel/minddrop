import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, RenameEventFixtures, cleanup, setup } from '../test-utils';
import { readRenameEvents } from '../utils';
import { retractRenameChainEnd } from './retractRenameChainEnd';

const {
  databaseRenameEvent,
  entryRenameEvent,
  propertyRenameEvent,
  getRenameEventFiles,
} = RenameEventFixtures;

describe('retractRenameChainEnd', () => {
  beforeEach(() => {
    setup();

    // Add the fixture rename events to the ledger
    MockFs.addFiles(getRenameEventFiles());
  });

  afterEach(cleanup);

  it('deletes the terminal event of the chain ending at the address', async () => {
    const retracted = await retractRenameChainEnd('Library/My Book', 'entry');

    // The terminal event should be returned and gone from the ledger
    expect(retracted).toEqual(entryRenameEvent);
    expect(await readRenameEvents()).toEqual([
      propertyRenameEvent,
      databaseRenameEvent,
    ]);
  });

  it('does nothing when no chain ends at the address', async () => {
    const retracted = await retractRenameChainEnd('Library/Other', 'entry');

    // The ledger should be untouched
    expect(retracted).toBeNull();
    expect(await readRenameEvents()).toEqual([
      entryRenameEvent,
      propertyRenameEvent,
      databaseRenameEvent,
    ]);
  });
});

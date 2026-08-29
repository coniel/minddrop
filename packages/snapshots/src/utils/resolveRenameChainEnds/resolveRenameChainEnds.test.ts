import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, RenameEventFixtures, cleanup, setup } from '../../test-utils';
import { RenameEvent } from '../../types';
import { resolveRenameChainEnds } from './resolveRenameChainEnds';

const { entryRenameEvent, propertyRenameEvent, getRenameEventFiles } =
  RenameEventFixtures;

const renamesDirPath = 'path/to/workspaces/Workspace 1/.minddrop/renames';

// An event continuing the fixture entry chain after the fixture
// database rename
const chainContinuationEvent: RenameEvent = {
  timestamp: new Date('2026-01-04T09:00:00.000Z'),
  from: 'Library/My Book',
  to: 'Library/Your Book',
  kind: 'entry',
};

describe('resolveRenameChainEnds', () => {
  beforeEach(() => {
    setup();

    // Add the fixture rename events to the ledger
    MockFs.addFiles(getRenameEventFiles());
  });

  afterEach(cleanup);

  it('maps chain end addresses to their terminal events', async () => {
    const chainEnds = await resolveRenameChainEnds('entry');

    // The entry chain ends at the renamed entry's address with the
    // database rename's prefix rewrite applied
    expect(chainEnds).toEqual(new Map([['Library/My Book', entryRenameEvent]]));
  });

  it('only includes chains of the requested kind', async () => {
    const chainEnds = await resolveRenameChainEnds('property');

    // Only the property chain should be included
    expect(chainEnds).toEqual(
      new Map([['Library/Writer', propertyRenameEvent]]),
    );
  });

  it('moves the chain end when a later event continues the chain', async () => {
    // Add an event renaming the chain's current end address
    MockFs.addFiles([
      {
        path: `${renamesDirPath}/20260104T090000000Z-your-book.json`,
        textContent: JSON.stringify(chainContinuationEvent),
      },
    ]);

    const chainEnds = await resolveRenameChainEnds('entry');

    // The chain should now end at the continuation's new address
    expect(chainEnds).toEqual(
      new Map([['Library/Your Book', chainContinuationEvent]]),
    );
  });

  it('returns an empty map when there is no ledger', async () => {
    // Remove the ledger directory added in the setup
    MockFs.reset();

    expect(await resolveRenameChainEnds('entry')).toEqual(new Map());
  });
});

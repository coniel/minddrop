import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, RenameEventFixtures, cleanup, setup } from '../test-utils';
import { isRenameChainEnd } from './isRenameChainEnd';

const { getRenameEventFiles } = RenameEventFixtures;

describe('isRenameChainEnd', () => {
  beforeEach(() => {
    setup();

    // Add the fixture rename events to the ledger
    MockFs.addFiles(getRenameEventFiles());
  });

  afterEach(cleanup);

  it('returns true for a chain end address', async () => {
    // The fixture entry chain ends at the renamed entry's address
    // with the database rename's prefix rewrite applied
    expect(await isRenameChainEnd('Library/My Book', 'entry')).toBe(true);
  });

  it('returns false for addresses no chain ends at', async () => {
    // The chain's pre-rename address is not its end
    expect(await isRenameChainEnd('Books/Book', 'entry')).toBe(false);
    expect(await isRenameChainEnd('Library/Other', 'entry')).toBe(false);
  });

  it('only considers chains of the address kind', async () => {
    // The property chain's end is not an entry chain end
    expect(await isRenameChainEnd('Library/Writer', 'entry')).toBe(false);
    expect(await isRenameChainEnd('Library/Writer', 'property')).toBe(true);
  });
});

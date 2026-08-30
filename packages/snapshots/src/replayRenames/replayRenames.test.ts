import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, RenameEventFixtures, cleanup, setup } from '../test-utils';
import { RenameEvent } from '../types';
import { replayRenames } from './replayRenames';

const { entryRenameEvent, databaseRenameEvent, getRenameEventFiles } =
  RenameEventFixtures;

const renamesDirPath = 'path/to/workspaces/Workspace 1/.minddrop/renames';

// A reference time from before any of the fixture events
const beforeAllEvents = new Date('2025-12-01T00:00:00.000Z');

// A chain of tag rename events, exercising the exact-match path
// for single-segment tag addresses
const tagRenameEvent: RenameEvent = {
  timestamp: new Date('2026-01-04T09:00:00.000Z'),
  from: 'Work',
  to: 'Projects',
  kind: 'tag',
  entityId: 'tag_1',
};
const tagChainContinuationEvent: RenameEvent = {
  timestamp: new Date('2026-01-05T09:00:00.000Z'),
  from: 'Projects',
  to: 'Focus',
  kind: 'tag',
  entityId: 'tag_1',
};

// The tag events' ledger files
const tagRenameEventFiles = [
  {
    path: `${renamesDirPath}/20260104T090000000Z-projects.json`,
    textContent: JSON.stringify(tagRenameEvent),
  },
  {
    path: `${renamesDirPath}/20260105T090000000Z-focus.json`,
    textContent: JSON.stringify(tagChainContinuationEvent),
  },
];

describe('replayRenames', () => {
  beforeEach(() => {
    setup();

    // Add the fixture rename events to the ledger
    MockFs.addFiles(getRenameEventFiles());
  });

  afterEach(cleanup);

  it('follows an address through successive renames', async () => {
    // The entry rename applies first, then the database rename
    // rewrites the renamed entry's database prefix
    expect(await replayRenames('Books/Book', 'entry', beforeAllEvents)).toBe(
      'Library/My Book',
    );
  });

  it('ignores events recorded at or before the reference time', async () => {
    // Only the later events postdate the entry event's timestamp
    expect(
      await replayRenames('Books/Book', 'entry', entryRenameEvent.timestamp),
    ).toBe('Library/Book');
  });

  it('only matches events of the address kind exactly', async () => {
    // An entry sharing its title with the renamed property is only
    // affected by the database rename
    expect(await replayRenames('Books/Author', 'entry', beforeAllEvents)).toBe(
      'Library/Author',
    );
  });

  it('resolves property addresses through property renames', async () => {
    // The property rename applies, then the database prefix rewrite
    expect(
      await replayRenames('Books/Author', 'property', beforeAllEvents),
    ).toBe('Library/Writer');
  });

  it('maps the renamed database itself', async () => {
    expect(await replayRenames('Books', 'database', beforeAllEvents)).toBe(
      'Library',
    );
  });

  it('does not match sibling databases sharing the name prefix', async () => {
    // "Bookshelf" starts with "Books" but is a different database
    expect(
      await replayRenames('Bookshelf/Note', 'entry', beforeAllEvents),
    ).toBe('Bookshelf/Note');
  });

  it('returns addresses untouched by any event unchanged', async () => {
    expect(await replayRenames('Recipes/Soup', 'entry', beforeAllEvents)).toBe(
      'Recipes/Soup',
    );
  });

  it('returns the address unchanged when there is no ledger', async () => {
    // Remove the ledger directory added in the setup
    MockFs.reset();

    expect(await replayRenames('Books/Book', 'entry', beforeAllEvents)).toBe(
      'Books/Book',
    );
  });

  it('resolves a reused address to the renamed entity', async () => {
    // A reference from after the rename points at the address's new
    // occupant rather than the renamed entity, so only the later
    // database rename applies
    expect(
      await replayRenames('Books/Book', 'entry', entryRenameEvent.timestamp),
    ).toBe('Library/Book');
  });

  it('resolves database addresses only through database events', async () => {
    // A reference from after the database rename stays put
    expect(
      await replayRenames('Books', 'database', databaseRenameEvent.timestamp),
    ).toBe('Books');
  });

  it('resolves tag addresses through tag rename chains', async () => {
    // Add the tag rename events to the ledger
    MockFs.addFiles(tagRenameEventFiles);

    // The address should follow the chain through both renames
    expect(await replayRenames('Work', 'tag', beforeAllEvents)).toBe('Focus');
  });

  it('does not rewrite tag addresses on database renames', async () => {
    // A tag sharing the renamed database's name is unaffected by
    // the database rename
    expect(await replayRenames('Books', 'tag', beforeAllEvents)).toBe('Books');
  });

  it('does not match same-named addresses of other kinds on tag renames', async () => {
    // Add the tag rename events to the ledger
    MockFs.addFiles(tagRenameEventFiles);

    // A database sharing the renamed tag's name is unaffected
    expect(await replayRenames('Work', 'database', beforeAllEvents)).toBe(
      'Work',
    );
  });
});

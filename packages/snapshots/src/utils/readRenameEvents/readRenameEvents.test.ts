import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, RenameEventFixtures, cleanup, setup } from '../../test-utils';
import { readRenameEvents } from './readRenameEvents';

const {
  databaseRenameEvent,
  entryRenameEvent,
  propertyRenameEvent,
  getRenameEventFiles,
} = RenameEventFixtures;

const renamesDirPath = 'path/to/workspaces/Workspace 1/.minddrop/renames';

describe('readRenameEvents', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('returns an empty array when there is no ledger directory', async () => {
    expect(await readRenameEvents()).toEqual([]);
  });

  it('reads events sorted chronologically', async () => {
    // Add the fixture event files in reverse chronological order
    MockFs.addFiles([...getRenameEventFiles()].reverse());

    // Events should come back in chronological order
    expect(await readRenameEvents()).toEqual([
      entryRenameEvent,
      propertyRenameEvent,
      databaseRenameEvent,
    ]);
  });

  it('ignores non event files', async () => {
    // Add a foreign OS metadata file alongside the events
    MockFs.addFiles([
      ...getRenameEventFiles(),
      { path: `${renamesDirPath}/.DS_Store`, textContent: '' },
    ]);

    expect(await readRenameEvents()).toEqual([
      entryRenameEvent,
      propertyRenameEvent,
      databaseRenameEvent,
    ]);
  });
});

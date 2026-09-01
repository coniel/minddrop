import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  Database,
  DatabaseEntry,
  DatabaseEntryDeletedEvent,
  DatabaseEntryRenamedEvent,
  DatabaseEntryWrittenEvent,
  DatabasePropertyRenamedEvent,
  DatabaseRenamedEvent,
  Databases,
} from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { recordRename } from '../recordRename';
import { MockFs, cleanup, setup } from '../test-utils';
import { readRenameEvents } from '../utils';
import { initializeSnapshots } from './initializeSnapshots';

const { objectDatabase, objectEntry1 } = DatabaseFixtures;

/**
 * Returns a copy of a database with the named property renamed
 * in its schema, matching the updated config carried by the
 * property renamed event.
 */
function renameProperty(
  database: Database,
  oldName: string,
  newName: string,
): Database {
  return {
    ...database,
    properties: database.properties.map((property) =>
      property.name === oldName ? { ...property, name: newName } : property,
    ),
  };
}

/**
 * Writes content into a new untitled entry and then gives it a
 * title, as creating an entry and naming it does.
 */
async function writeAndTitle(
  id: DatabaseEntry['id'],
  title: string,
): Promise<void> {
  const entry = {
    ...objectEntry1,
    id,
    title: 'Untitled',
    path: `${objectDatabase.path}/Untitled.md`,
  };

  await Events.dispatch(DatabaseEntryWrittenEvent, {
    entry,
    database: objectDatabase,
    previousContents: `The contents ${id} replaced`,
    contents: `The contents written into ${id}`,
  });

  await Events.dispatch(DatabaseEntryRenamedEvent, {
    original: entry,
    updated: {
      ...entry,
      title,
      path: `${objectDatabase.path}/${title}.md`,
    },
  });
}

/**
 * Returns the number of snapshots held in a subject's history
 * directory.
 *
 * Counts the directories rather than reading them through
 * `Snapshots.list`, as the mock file system does not carry file
 * contents through a directory rename.
 */
async function snapshotCount(historyDirPath: string): Promise<number> {
  const snapshots = await Fs.readDir(historyDirPath);

  return snapshots.length;
}

describe('initializeSnapshots', () => {
  beforeEach(() => {
    setup();

    // Load the database so entry handlers can resolve its name
    Databases.Store.load([objectDatabase]);

    // Register the event subscriptions
    initializeSnapshots();
  });

  afterEach(() => {
    cleanup();
    Databases.Store.clear();
  });

  it('captures the contents an entry write replaced', async () => {
    // Dispatch an entry written event
    await Events.dispatch(DatabaseEntryWrittenEvent, {
      entry: objectEntry1,
      database: objectDatabase,
      previousContents: 'The contents the write replaced',
      contents: 'The contents that were written',
    });

    expect(
      MockFs.readTextFile(
        `${objectDatabase.path}/.minddrop/history/Test Entry/2026-06-01T000000Z/Test Entry.md`,
      ),
    ).toBe('The contents the write replaced');
  });

  it('keeps the histories of successive untitled entries apart', async () => {
    const historyDirPath = `${objectDatabase.path}/.minddrop/history`;

    // Write into an untitled entry, then give it a title
    await writeAndTitle('database-entry_a', 'Note A');

    // Do the same with a second entry, which takes the untitled
    // title freed up by the first being renamed
    await writeAndTitle('database-entry_b', 'Note B');

    // Each entry's history should have followed it to its title,
    // leaving nothing under the shared untitled one
    expect(MockFs.exists(`${historyDirPath}/Untitled`)).toBe(false);
    expect(await snapshotCount(`${historyDirPath}/Note A`)).toBe(1);
    expect(await snapshotCount(`${historyDirPath}/Note B`)).toBe(1);
  });

  it('does not hand a discarded untitled entry history to the next one', async () => {
    const historyDirPath = `${objectDatabase.path}/.minddrop/history`;
    const entry = {
      ...objectEntry1,
      title: 'Untitled',
      path: `${objectDatabase.path}/Untitled.md`,
    };

    // Content written into an untitled entry, which is then discarded
    await Events.dispatch(DatabaseEntryWrittenEvent, {
      entry,
      database: objectDatabase,
      previousContents: 'The contents of a discarded entry',
      contents: 'The contents written into it',
    });
    await Events.dispatch(DatabaseEntryDeletedEvent, entry);

    // A new untitled entry, taking the title the deletion freed
    await Events.dispatch(DatabaseEntryWrittenEvent, {
      entry: { ...entry, id: 'database-entry_b' },
      database: objectDatabase,
      previousContents: 'The contents of a new entry',
      contents: 'The contents written into it',
    });

    // The history under the untitled title should be the new entry's
    // own, rather than what the discarded one left behind
    expect(
      MockFs.readTextFile(
        `${historyDirPath}/Untitled/2026-06-01T000000Z/Untitled.md`,
      ),
    ).toBe('The contents of a new entry');
  });

  it('records entry renames', async () => {
    // Dispatch an entry rename event
    await Events.dispatch(DatabaseEntryRenamedEvent, {
      original: objectEntry1,
      updated: { ...objectEntry1, title: 'Renamed' },
    });

    // The rename should be recorded in the ledger
    expect(await readRenameEvents()).toEqual([
      expect.objectContaining({
        from: 'Objects/Test Entry',
        to: 'Objects/Renamed',
        kind: 'entry',
      }),
    ]);
  });

  it('records database renames', async () => {
    // Dispatch a database rename event
    await Events.dispatch(DatabaseRenamedEvent, {
      original: objectDatabase,
      updated: { ...objectDatabase, name: 'Renamed Objects' },
    });

    // The rename should be recorded in the ledger
    expect(await readRenameEvents()).toEqual([
      expect.objectContaining({
        from: 'Objects',
        to: 'Renamed Objects',
        kind: 'database',
      }),
    ]);
  });

  it('records property renames', async () => {
    // Dispatch a property rename event
    await Events.dispatch(DatabasePropertyRenamedEvent, {
      original: objectDatabase,
      updated: renameProperty(objectDatabase, 'Content', 'Body'),
      oldName: 'Content',
      newName: 'Body',
    });

    // The rename should be recorded in the ledger
    expect(await readRenameEvents()).toEqual([
      expect.objectContaining({
        from: 'Objects/Content',
        to: 'Objects/Body',
        kind: 'property',
      }),
    ]);
  });

  it('retracts dead untitled chains on entry deletion', async () => {
    // Record a rename ending at the untitled address, as clearing
    // the entry's title would
    await recordRename({
      from: 'Objects/Test Entry',
      to: 'Objects/Untitled',
      kind: 'entry',
    });

    // Dispatch a deletion event for the untitled entry
    await Events.dispatch(DatabaseEntryDeletedEvent, {
      ...objectEntry1,
      title: 'Untitled',
    });

    // The dead chain's terminal event should be gone
    expect(await readRenameEvents()).toEqual([]);
  });
});

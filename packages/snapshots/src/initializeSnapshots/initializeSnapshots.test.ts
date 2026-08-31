import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  Database,
  DatabaseEntryDeletedEvent,
  DatabaseEntryRenamedEvent,
  DatabasePropertyRenamedEvent,
  DatabaseRenamedEvent,
  Databases,
} from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { recordRename } from '../recordRename';
import { cleanup, setup } from '../test-utils';
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

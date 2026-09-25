import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { SelectPropertySchema } from '@minddrop/properties';
import { storeItem } from '@minddrop/stores/test-utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseEntryUpdatedEvent } from '../events';
import { DatabaseFixtures, MockFs, cleanup, setup } from '../test-utils';
import { resolveDatabaseEntryPath, resolveDatabasePath } from '../utils';
import { renameDatabaseEntriesPropertyOption } from './renameDatabaseEntriesPropertyOption';

const { objectDatabase, objectEntry1 } = DatabaseFixtures;

// The renamed single-select property, with the new value
const statusProperty: SelectPropertySchema = {
  type: 'select',
  name: 'Status',
  options: [
    { value: 'Doing', color: 'blue' },
    { value: 'Done', color: 'green' },
  ],
};

// The renamed multiselect property, with the new value
const labelsProperty: SelectPropertySchema = {
  type: 'select',
  name: 'Labels',
  multiselect: true,
  options: [
    { value: 'House', color: 'red' },
    { value: 'Work', color: 'cyan' },
  ],
};

// A database with the renamed select properties
const selectDatabase = {
  ...objectDatabase,
  id: 'database_select-test' as const,
  name: 'Select Objects',
  path: `${objectDatabase.path} Select`,
  properties: [...objectDatabase.properties, statusProperty, labelsProperty],
};

// An entry with the renamed option in both properties
const selectEntry = {
  ...objectEntry1,
  id: 'database-entry_select-entry' as const,
  title: 'Select Entry',
  database: selectDatabase.id,
  path: 'Select Entry.md',
  properties: {
    ...objectEntry1.properties,
    Status: 'Todo',
    Labels: ['Home', 'Work'],
  },
};

// An entry with a different option value
const otherEntry = {
  ...objectEntry1,
  id: 'database-entry_select-other-entry' as const,
  title: 'Other Entry',
  database: selectDatabase.id,
  path: 'Other Entry.md',
  properties: {
    ...objectEntry1.properties,
    Status: 'Done',
  },
};

describe('renameDatabaseEntriesPropertyOption', () => {
  beforeEach(() => {
    setup();

    // Add the select database and its entries to the stores
    DatabasesStore.set(selectDatabase);
    DatabaseEntriesStore.set(selectEntry);
    DatabaseEntriesStore.set(otherEntry);

    // Create the database directory so entry rewrites can write
    // the entry files.
    MockFs.addFiles([resolveDatabasePath(selectDatabase)]);
  });

  afterEach(cleanup);

  it('rewrites the option value in the entries which have it', async () => {
    await renameDatabaseEntriesPropertyOption(
      selectDatabase.id,
      statusProperty,
      'Todo',
      'Doing',
    );

    expect(
      storeItem(DatabaseEntriesStore, selectEntry.id).properties.Status,
    ).toBe('Doing');
    expect(
      storeItem(DatabaseEntriesStore, otherEntry.id).properties.Status,
    ).toBe('Done');
  });

  it('rewrites multiselect values and keeps the other options', async () => {
    await renameDatabaseEntriesPropertyOption(
      selectDatabase.id,
      labelsProperty,
      'Home',
      'House',
    );

    expect(
      storeItem(DatabaseEntriesStore, selectEntry.id).properties.Labels,
    ).toEqual(['House', 'Work']);
  });

  it('rewrites the entry files with the new value', async () => {
    await renameDatabaseEntriesPropertyOption(
      selectDatabase.id,
      statusProperty,
      'Todo',
      'Doing',
    );

    // The entry file should contain the new value and not the old
    const contents = MockFs.readTextFile(
      resolveDatabaseEntryPath(selectEntry, selectDatabase),
    );
    expect(contents).toContain('Doing');
    expect(contents).not.toContain('Todo');
  });

  it('returns the rewritten entries', async () => {
    const entries = await renameDatabaseEntriesPropertyOption(
      selectDatabase.id,
      statusProperty,
      'Todo',
      'Doing',
    );

    expect(entries).toEqual([
      {
        ...selectEntry,
        properties: { ...selectEntry.properties, Status: 'Doing' },
      },
    ]);
  });

  it('does not dispatch an entry updated event for the rewrite', async () => {
    // The number of entry updated events dispatched
    let updatedEntries = 0;

    // Count the entry updated events the rewrite dispatches
    Events.addListener(DatabaseEntryUpdatedEvent, 'test', () => {
      updatedEntries += 1;
    });

    await renameDatabaseEntriesPropertyOption(
      selectDatabase.id,
      statusProperty,
      'Todo',
      'Doing',
    );

    // Let queued listeners run
    await Promise.resolve();

    // Remove the listener
    Events.removeListener(DatabaseEntryUpdatedEvent, 'test');

    expect(updatedEntries).toBe(0);
  });
});

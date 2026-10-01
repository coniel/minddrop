import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { History } from '@minddrop/history';
import { SelectPropertySchema } from '@minddrop/properties';
import { storeItem } from '@minddrop/stores/test-utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { DatabaseHistoryCauses } from '../../constants';
import { DatabaseEntryUpdatedEvent } from '../../events';
import { sqlGetEntryPropertyValues, sqlUpsertDatabase } from '../../sql';
import {
  MockFs,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  clearRecordedSqlStatements,
  getRecordedSqlStatements,
  objectDatabase,
  objectEntry1,
  setup,
  setupRecordingTestSqlDatabase,
} from '../../test-utils';
import {
  resolveDatabaseEntryHistorySubject,
  resolveDatabaseEntryPath,
  resolveDatabasePath,
} from '../../utils';
import { onRenamePropertyOption } from './property-option-renamed';

// The renamed single-select property, holding the new value
const statusProperty: SelectPropertySchema = {
  type: 'select',
  name: 'Status',
  options: [
    { value: 'Doing', color: 'blue' },
    { value: 'Done', color: 'green' },
  ],
};

// The renamed multiselect property, holding the new value
const labelsProperty: SelectPropertySchema = {
  type: 'select',
  name: 'Labels',
  multiselect: true,
  options: [
    { value: 'House', color: 'red' },
    { value: 'Work', color: 'cyan' },
  ],
};

// A database holding the renamed select properties
const selectDatabase = {
  ...objectDatabase,
  id: 'database_select-test' as const,
  name: 'Select Objects',
  path: `${objectDatabase.path} Select`,
  properties: [...objectDatabase.properties, statusProperty, labelsProperty],
};

// An entry holding the renamed option in both properties
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

// A second entry with the renamed status option
const secondEntry = {
  ...selectEntry,
  id: 'database-entry_select-second-entry' as const,
  title: 'Second Entry',
  path: 'Second Entry.md',
  properties: { ...objectEntry1.properties, Status: 'Todo' },
};

// An entry holding a different option value
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

// The action performing the rename
const action = History.createAction(DatabaseHistoryCauses.PropertyOptionRenamed);

/**
 * Runs the handler for a rename of the status option 'Todo' to
 * 'Doing'.
 */
function renameStatusOption(): Promise<void> {
  return onRenamePropertyOption({
    original: selectDatabase,
    updated: selectDatabase,
    property: statusProperty,
    oldValue: 'Todo',
    newValue: 'Doing',
    action,
  });
}

describe('onRenamePropertyOption', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Add the select database and its entries to the stores
    DatabasesStore.set(selectDatabase);
    DatabaseEntriesStore.set(selectEntry);
    DatabaseEntriesStore.set(secondEntry);
    DatabaseEntriesStore.set(otherEntry);

    // Add the database's SQL record so entry upserts satisfy the
    // foreign key. The statement is then dropped from the recording.
    sqlUpsertDatabase(selectDatabase, { silent: true });
    clearRecordedSqlStatements();

    // Create the database directory so entry rewrites can write
    // the entry files.
    MockFs.addFiles([resolveDatabasePath(selectDatabase)]);
  });

  afterEach(async () => {
    cleanupRecordingTestSqlDatabase();
    await cleanup();
  });

  it('rewrites the option value in entries holding it', async () => {
    await renameStatusOption();

    expect(
      storeItem(DatabaseEntriesStore, selectEntry.id).properties.Status,
    ).toBe('Doing');
    expect(
      storeItem(DatabaseEntriesStore, otherEntry.id).properties.Status,
    ).toBe('Done');
  });

  it('rewrites multiselect values keeping the other options', async () => {
    await onRenamePropertyOption({
      original: selectDatabase,
      updated: selectDatabase,
      property: labelsProperty,
      oldValue: 'Home',
      newValue: 'House',
      action,
    });

    expect(
      storeItem(DatabaseEntriesStore, selectEntry.id).properties.Labels,
    ).toEqual(['House', 'Work']);
  });

  it('writes the rewritten entries to the file system', async () => {
    await renameStatusOption();

    // The entry file should contain the new value and not the old
    const contents = MockFs.readTextFile(
      resolveDatabaseEntryPath(selectEntry, selectDatabase),
    );
    expect(contents).toContain('Doing');
    expect(contents).not.toContain('Todo');
  });

  it('updates the SQL records with the rewritten values', async () => {
    await renameStatusOption();

    // The entry's SQL property values should have the new value
    const values = sqlGetEntryPropertyValues(selectEntry.id).map(
      (property) => property.value,
    );
    expect(values).toContain('Doing');
    expect(values).not.toContain('Todo');
  });

  it('issues no SQL when no entry has the option', async () => {
    await onRenamePropertyOption({
      original: selectDatabase,
      updated: selectDatabase,
      property: statusProperty,
      oldValue: 'Unused',
      newValue: 'Still Unused',
      action,
    });

    expect(getRecordedSqlStatements()).toEqual([]);
  });

  it('does not dispatch an entry updated event for the rewrite', async () => {
    // The number of entry updated events dispatched
    let updatedEntries = 0;

    // Count the entry updated events the rewrite dispatches
    Events.addListener(DatabaseEntryUpdatedEvent, 'test', () => {
      updatedEntries += 1;
    });

    await renameStatusOption();

    // Let queued listeners run
    await Promise.resolve();

    // Remove the listener
    Events.removeListener(DatabaseEntryUpdatedEvent, 'test');

    expect(updatedEntries).toBe(0);
  });

  it('records the rename against the entries with the option', async () => {
    await renameStatusOption();

    expect(
      await History.read(
        resolveDatabaseEntryHistorySubject(selectDatabase, selectEntry),
      ),
    ).toContainEqual(
      expect.objectContaining({
        kind: 'rename',
        target: 'value-label',
        property: statusProperty.name,
        from: 'Todo',
        to: 'Doing',
      }),
    );
  });

  it("stamps the rename's action on every record", async () => {
    await renameStatusOption();

    const records = await Promise.all(
      [selectEntry, secondEntry].map((entry) =>
        History.read(resolveDatabaseEntryHistorySubject(selectDatabase, entry)),
      ),
    );

    // Both entries' records should have the same action
    expect(records.flat().map((record) => record.action)).toEqual([
      action,
      action,
    ]);
  });

  it('records nothing against entries which do not hold it', async () => {
    await renameStatusOption();

    expect(
      await History.read(
        resolveDatabaseEntryHistorySubject(selectDatabase, otherEntry),
      ),
    ).toEqual([]);
  });
});

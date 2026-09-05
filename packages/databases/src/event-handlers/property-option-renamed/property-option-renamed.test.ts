import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SelectPropertySchema } from '@minddrop/properties';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../../test-utils';
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
  path: `${selectDatabase.path}/Select Entry.md`,
  properties: {
    ...objectEntry1.properties,
    Status: 'Todo',
    Labels: ['Home', 'Work'],
  },
};

// An entry holding a different option value
const otherEntry = {
  ...objectEntry1,
  id: 'database-entry_select-other-entry' as const,
  title: 'Other Entry',
  database: selectDatabase.id,
  path: `${selectDatabase.path}/Other Entry.md`,
  properties: {
    ...objectEntry1.properties,
    Status: 'Done',
  },
};

describe('onRenamePropertyOption', () => {
  beforeEach(() => {
    setup();

    // Add the select database and its entries to the stores
    DatabasesStore.set(selectDatabase);
    DatabaseEntriesStore.set(selectEntry);
    DatabaseEntriesStore.set(otherEntry);

    // Create the database directory so entry rewrites can write
    // the entry files
    MockFs.addFiles([selectDatabase.path]);
  });

  afterEach(cleanup);

  it('rewrites the option value in entries holding it', async () => {
    await onRenamePropertyOption({
      original: selectDatabase,
      updated: selectDatabase,
      property: statusProperty,
      oldValue: 'Todo',
      newValue: 'Doing',
    });

    expect(DatabaseEntriesStore.get(selectEntry.id)?.properties.Status).toBe(
      'Doing',
    );
    expect(DatabaseEntriesStore.get(otherEntry.id)?.properties.Status).toBe(
      'Done',
    );
  });

  it('rewrites multiselect values keeping the other options', async () => {
    await onRenamePropertyOption({
      original: selectDatabase,
      updated: selectDatabase,
      property: labelsProperty,
      oldValue: 'Home',
      newValue: 'House',
    });

    expect(DatabaseEntriesStore.get(selectEntry.id)?.properties.Labels).toEqual(
      ['House', 'Work'],
    );
  });
});

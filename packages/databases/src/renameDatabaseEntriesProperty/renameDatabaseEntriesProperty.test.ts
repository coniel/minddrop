import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { storeItem } from '@minddrop/stores/test-utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { renameDatabaseEntriesProperty } from './renameDatabaseEntriesProperty';

// The object database's icon property, as declared before a rename
const iconProperty = objectDatabase.properties[1];

describe('renameDatabaseEntriesProperty', () => {
  beforeEach(() => {
    setup();

    // Rename the property in the schema, as the rename has already
    // done by the time the entries are re-keyed.
    DatabasesStore.update(objectDatabase.id, {
      properties: [
        objectDatabase.properties[0],
        { ...iconProperty, name: 'Symbol' },
      ],
    });
  });

  afterEach(cleanup);

  it('re-keys the value in the entries that have one', async () => {
    await renameDatabaseEntriesProperty(
      objectDatabase.id,
      iconProperty,
      'Symbol',
    );

    // Get the entry from the store
    const entry = storeItem(DatabaseEntriesStore, objectEntry1.id);

    // The value should be under the new name, in its original
    // position.
    expect(Object.keys(entry.properties)).toEqual(['Content', 'Symbol']);
    expect(entry.properties.Symbol).toBe(objectEntry1.properties.Icon);
  });

  it('rewrites the entry files under the new name', async () => {
    await renameDatabaseEntriesProperty(
      objectDatabase.id,
      iconProperty,
      'Symbol',
    );

    // Read the entry's file
    const contents = MockFs.readTextFile(
      `${databaseDirPath(objectDatabase)}/${objectEntry1.path}`,
    );

    // The frontmatter key should be renamed rather than duplicated
    expect(contents).toContain(`Symbol: ${objectEntry1.properties.Icon}`);
    expect(contents).not.toContain('Icon:');
  });

  it('leaves entries without a value for the property alone', async () => {
    // Drop the property's value from the entry
    DatabaseEntriesStore.update(objectEntry1.id, {
      properties: { Content: objectEntry1.properties.Content },
    });

    await renameDatabaseEntriesProperty(
      objectDatabase.id,
      iconProperty,
      'Symbol',
    );

    // No value should have been invented under the new name
    expect(
      storeItem(DatabaseEntriesStore, objectEntry1.id).properties,
    ).not.toHaveProperty('Symbol');
  });
});

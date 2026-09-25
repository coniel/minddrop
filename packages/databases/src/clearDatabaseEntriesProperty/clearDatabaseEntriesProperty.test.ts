import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { storeItem } from '@minddrop/stores/test-utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseEntryUpdatedEvent } from '../events';
import { DatabaseFixtures, MockFs, cleanup, setup } from '../test-utils';
import { clearDatabaseEntriesProperty } from './clearDatabaseEntriesProperty';

const { databaseDirPath, objectDatabase, objectEntry1 } = DatabaseFixtures;

// The object database's icon property, as declared before its removal
const iconProperty = objectDatabase.properties[1];

describe('clearDatabaseEntriesProperty', () => {
  beforeEach(() => {
    setup();

    // Remove the property from the schema, as the removal has already
    // done so by the time the entries are cleared.
    DatabasesStore.update(objectDatabase.id, {
      properties: [objectDatabase.properties[0]],
    });
  });

  afterEach(cleanup);

  it('drops the value from the entries that have one', async () => {
    await clearDatabaseEntriesProperty(objectDatabase.id, iconProperty);

    // The entry should have its other values. The cleared one should
    // be gone.
    expect(storeItem(DatabaseEntriesStore, objectEntry1.id).properties).toEqual(
      { Content: objectEntry1.properties.Content },
    );
  });

  it('rewrites the entry files without the value', async () => {
    await clearDatabaseEntriesProperty(objectDatabase.id, iconProperty);

    // Read the entry's file
    const contents = MockFs.readTextFile(
      `${databaseDirPath(objectDatabase)}/${objectEntry1.path}`,
    );

    // The frontmatter key should be gone
    expect(contents).not.toContain('Icon:');
  });

  it('returns the rewritten entries with the values they had', async () => {
    const cleared = await clearDatabaseEntriesProperty(
      objectDatabase.id,
      iconProperty,
    );

    expect(cleared).toEqual([
      {
        entry: {
          ...objectEntry1,
          properties: { Content: objectEntry1.properties.Content },
        },
        value: objectEntry1.properties.Icon,
      },
    ]);
  });

  it('does not dispatch an entry updated event for the rewrite', async () => {
    let updatedEntries = 0;

    // Count the entry updated events the rewrite dispatches
    Events.addListener(DatabaseEntryUpdatedEvent, 'test', () => {
      updatedEntries += 1;
    });

    await clearDatabaseEntriesProperty(objectDatabase.id, iconProperty);

    // Let queued listeners run
    await Promise.resolve();

    Events.removeListener(DatabaseEntryUpdatedEvent, 'test');

    expect(updatedEntries).toBe(0);
  });

  it('leaves entries without a value for the property alone', async () => {
    // Drop the property's value from the entry
    DatabaseEntriesStore.update(objectEntry1.id, {
      properties: { Content: objectEntry1.properties.Content },
    });

    const cleared = await clearDatabaseEntriesProperty(
      objectDatabase.id,
      iconProperty,
    );

    // Nothing should have been rewritten
    expect(cleared).toEqual([]);
  });
});

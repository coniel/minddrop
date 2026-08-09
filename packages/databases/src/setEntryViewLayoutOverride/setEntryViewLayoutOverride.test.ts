import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures, LayoutNotFoundError } from '@minddrop/designs';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { flushDatabaseMetadata } from '../updateEntryMetadata';
import { databaseMetadataFilePath, entryMetadataKey } from '../utils';
import { setEntryViewLayoutOverride } from './setEntryViewLayoutOverride';

const { layout_card_1, layout_card_2, layout_card_3 } = DesignFixtures;

const metadataFilePath = databaseMetadataFilePath(objectDatabase.path);

// The database-relative key the entry's metadata is stored under
const metadataKey = entryMetadataKey(objectEntry1.path, objectDatabase.path);

describe('setEntryViewLayoutOverride', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the layout is not part of the database design', () => {
    // layout_card_1 does not belong to objectDatabase's design
    expect(() =>
      setEntryViewLayoutOverride(objectEntry1.id, 'view-1', layout_card_1.id),
    ).toThrow(LayoutNotFoundError);
  });

  it('throws if the database has no design', () => {
    // Clear the database's design assignment
    DatabasesStore.update(objectDatabase.id, { designId: null });

    expect(() =>
      setEntryViewLayoutOverride(objectEntry1.id, 'view-1', layout_card_2.id),
    ).toThrow(LayoutNotFoundError);
  });

  it('sets the layout override on the entry metadata', async () => {
    // Set a layout override
    setEntryViewLayoutOverride(objectEntry1.id, 'view-1', layout_card_2.id);

    // Flush to write to disk
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written[metadataKey].viewLayoutOverrides).toEqual({
      'view-1': layout_card_2.id,
    });
  });

  it('preserves earlier overrides across successive calls', async () => {
    // Set overrides for two different views in succession
    setEntryViewLayoutOverride(objectEntry1.id, 'view-1', layout_card_2.id);
    setEntryViewLayoutOverride(objectEntry1.id, 'view-2', layout_card_3.id);

    // Flush to write to disk
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    // Both overrides should be persisted
    expect(written[metadataKey].viewLayoutOverrides).toEqual({
      'view-1': layout_card_2.id,
      'view-2': layout_card_3.id,
    });
  });

  it('preserves existing layout overrides', async () => {
    // Set up an existing layout override on the entry in the store
    DatabaseEntriesStore.update(objectEntry1.id, {
      metadata: {
        ...objectEntry1.metadata,
        viewLayoutOverrides: {
          'view-1': layout_card_2.id,
        },
      },
    });

    // Set a second layout override
    setEntryViewLayoutOverride(objectEntry1.id, 'view-2', layout_card_3.id);

    // Flush to write to disk
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written[metadataKey].viewLayoutOverrides).toEqual({
      'view-1': layout_card_2.id,
      'view-2': layout_card_3.id,
    });
  });
});

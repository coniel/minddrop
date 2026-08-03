import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { flushDatabaseMetadata } from '../updateEntryMetadata';
import { databaseMetadataFilePath, entryMetadataKey } from '../utils';
import { clearEntryViewLayoutOverride } from './clearEntryViewLayoutOverride';

const { layout_card_1, layout_list_1 } = DesignFixtures;

const metadataFilePath = databaseMetadataFilePath(objectDatabase.path);

// The database-relative key the entry's metadata is stored under
const metadataKey = entryMetadataKey(objectEntry1.path, objectDatabase.path);

describe('clearEntryViewLayoutOverride', () => {
  beforeEach(() => {
    setup();

    // Set up layout overrides on the entry in the store
    DatabaseEntriesStore.update(objectEntry1.id, {
      metadata: {
        ...objectEntry1.metadata,
        viewLayoutOverrides: {
          'view-1': layout_card_1.id,
          'view-2': layout_list_1.id,
        },
      },
    });
  });

  afterEach(cleanup);

  it('removes the layout override from the entry metadata', async () => {
    // Clear one override
    clearEntryViewLayoutOverride(objectEntry1.id, 'view-1');

    // Flush to write to disk
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written[metadataKey].viewLayoutOverrides).toEqual({
      'view-2': layout_list_1.id,
    });
  });

  it('preserves other metadata when clearing an override', async () => {
    // Add embedded view configs metadata alongside layout overrides
    DatabaseEntriesStore.update(objectEntry1.id, {
      metadata: {
        embeddedViewConfigs: { 'card:Tags': { options: {}, data: {} } },
        viewLayoutOverrides: {
          'view-1': layout_card_1.id,
        },
      },
    });

    // Clear the override
    clearEntryViewLayoutOverride(objectEntry1.id, 'view-1');

    // Flush to write to disk
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    // Views metadata should still be present
    expect(written[metadataKey].embeddedViewConfigs).toEqual({
      'card:Tags': { options: {}, data: {} },
    });

    // Layout overrides should be empty
    expect(written[metadataKey].viewLayoutOverrides).toEqual({});
  });
});

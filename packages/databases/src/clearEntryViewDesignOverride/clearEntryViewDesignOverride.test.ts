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
import { databaseMetadataFilePath } from '../utils';
import { clearEntryViewDesignOverride } from './clearEntryViewDesignOverride';

const { design_card_1, design_list_1 } = DesignFixtures;

const metadataFilePath = databaseMetadataFilePath(objectDatabase.path);

describe('clearEntryViewDesignOverride', () => {
  beforeEach(() => {
    setup();

    // Set up design overrides on the entry in the store
    DatabaseEntriesStore.update(objectEntry1.id, {
      metadata: {
        ...objectEntry1.metadata,
        designOverrides: {
          'view-1': design_card_1.id,
          'view-2': design_list_1.id,
        },
      },
    });
  });

  afterEach(cleanup);

  it('removes the design override from the entry metadata', async () => {
    // Clear one override
    clearEntryViewDesignOverride(objectEntry1.id, 'view-1');

    // Flush to write to disk
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written[objectEntry1.id].designOverrides).toEqual({
      'view-2': design_list_1.id,
    });
  });

  it('preserves other metadata when clearing an override', async () => {
    // Add views metadata alongside design overrides
    DatabaseEntriesStore.update(objectEntry1.id, {
      metadata: {
        views: { 'card:Tags': { options: {}, data: {} } },
        designOverrides: {
          'view-1': design_card_1.id,
        },
      },
    });

    // Clear the override
    clearEntryViewDesignOverride(objectEntry1.id, 'view-1');

    // Flush to write to disk
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    // Views metadata should still be present
    expect(written[objectEntry1.id].views).toEqual({
      'card:Tags': { options: {}, data: {} },
    });

    // Design overrides should be empty
    expect(written[objectEntry1.id].designOverrides).toEqual({});
  });
});

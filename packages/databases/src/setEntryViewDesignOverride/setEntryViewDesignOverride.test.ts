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
import { setEntryViewDesignOverride } from './setEntryViewDesignOverride';

const { design_card_1, design_list_1 } = DesignFixtures;

const metadataFilePath = databaseMetadataFilePath(objectDatabase.path);

describe('setEntryViewDesignOverride', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the design override on the entry metadata', async () => {
    // Set a design override
    setEntryViewDesignOverride(objectEntry1.id, 'view-1', design_card_1.id);

    // Flush to write to disk
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written[objectEntry1.id].designOverrides).toEqual({
      'view-1': design_card_1.id,
    });
  });

  it('preserves existing design overrides', async () => {
    // Set up an existing design override on the entry in the store
    DatabaseEntriesStore.update(objectEntry1.id, {
      metadata: {
        ...objectEntry1.metadata,
        designOverrides: {
          'view-1': design_card_1.id,
        },
      },
    });

    // Set a second design override
    setEntryViewDesignOverride(objectEntry1.id, 'view-2', design_list_1.id);

    // Flush to write to disk
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written[objectEntry1.id].designOverrides).toEqual({
      'view-1': design_card_1.id,
      'view-2': design_list_1.id,
    });
  });
});

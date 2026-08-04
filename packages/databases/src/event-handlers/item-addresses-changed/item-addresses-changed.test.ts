import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  relatedEntry1,
  setup,
} from '../../test-utils';
import { databaseEntryAddress } from '../../utils';
import { onItemAddressesChanged } from './item-addresses-changed';

describe('onItemAddressesChanged', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("rewrites referencing entries' files with current addresses", async () => {
    // Simulate a rename of a referenced entry
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: 'Renamed Related',
      path: `${collectionDatabase.path}/Renamed Related.md`,
    });

    await onItemAddressesChanged([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1.path),
        newReference: databaseEntryAddress(
          `${collectionDatabase.path}/Renamed Related.md`,
        ),
      },
    ]);

    const contents = MockFs.readTextFile(collectionEntry1.path);

    // The referencing file should contain the new address
    expect(contents).toContain('Collection Database/Renamed Related.md');
    expect(contents).not.toContain('Collection Database/Related Entry 1.md');
  });

  it('does nothing for unreferenced items', async () => {
    const before = MockFs.readTextFile(collectionEntry1.path);

    await onItemAddressesChanged([
      {
        id: 'database-entry_unreferenced',
        oldReference: 'old',
        newReference: 'new',
      },
    ]);

    expect(MockFs.readTextFile(collectionEntry1.path)).toBe(before);
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyMap } from '@minddrop/properties';
import { EntriesStore } from '../../EntriesStore';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  collectionEntry1FileContents,
  entryFilePath,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  rootStorageDatabase,
  setup,
} from '../../test-utils';
import { writeEntry } from '../../writeEntry';
import { resolveEntryAddress } from '../resolveEntryAddress';
import { resolveCollectionProperties } from './resolveCollectionProperties';

// Address index containing the referenced fixture entries, keyed
// lowercased as the resolve path expects.
const entryIdByAddress = new Map([
  [
    resolveEntryAddress(relatedEntry1, collectionDatabase).toLowerCase(),
    relatedEntry1.id,
  ],
  [
    resolveEntryAddress(relatedEntry2, collectionDatabase).toLowerCase(),
    relatedEntry2.id,
  ],
  [
    resolveEntryAddress(referenceEntry1, rootStorageDatabase).toLowerCase(),
    referenceEntry1.id,
  ],
]);

// The user's hand-written reference to an entry which does not exist yet
const unresolvedAddress = 'Projects/Not Yet Created';

describe('resolveCollectionProperties', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('resolves collection property addresses to entry IDs', () => {
    const resolved = resolveCollectionProperties(
      serializedProperties(),
      collectionDatabase,
      entryIdByAddress,
    );

    expect(resolved.Related).toEqual([relatedEntry1.id, relatedEntry2.id]);
    expect(resolved.References).toEqual([referenceEntry1.id]);
  });

  it('leaves non-collection properties untouched', () => {
    const resolved = resolveCollectionProperties(
      serializedProperties(),
      collectionDatabase,
      entryIdByAddress,
    );

    expect(resolved.Title).toBe(collectionEntry1.properties.Title);
  });

  it('drops addresses that do not resolve', () => {
    const resolved = resolveCollectionProperties(
      { ...serializedProperties(), Related: ['old-uuid-value'] },
      collectionDatabase,
      entryIdByAddress,
    );

    expect(resolved.Related).toEqual([]);
  });

  it('sets up an entry file with an address which does not resolve', () => {
    addUnresolvedAddressToEntryFile();

    expect(MockFs.readTextFile(entryFilePath(collectionEntry1))).toContain(
      unresolvedAddress,
    );
  });

  // Pins Issue 35: Collection-property addresses that do not resolve at index
  // time are dropped. The next writeEntry removes them from the entry file.
  // Remove .fails once fixed.
  it.fails(
    'keeps an address which does not resolve in the entry file when the entry is next written',
    async () => {
      const properties = addUnresolvedAddressToEntryFile();

      // Index the entry as the sync does, then write it back
      EntriesStore.update(collectionEntry1.id, {
        properties: resolveCollectionProperties(
          properties,
          collectionDatabase,
          entryIdByAddress,
        ),
      });
      await writeEntry(collectionEntry1.id);

      // Expect the file to still have the address
      expect(MockFs.readTextFile(entryFilePath(collectionEntry1))).toContain(
        unresolvedAddress,
      );
    },
  );

  it('does not mutate the input properties', () => {
    const properties = serializedProperties();
    const original = { ...properties };

    resolveCollectionProperties(
      properties,
      collectionDatabase,
      entryIdByAddress,
    );

    expect(properties).toEqual(original);
  });
});

/**
 * Adds an address which does not resolve to collectionEntry1's file.
 *
 * @returns The entry's serialized properties, with the address added.
 */
function addUnresolvedAddressToEntryFile(): PropertyMap {
  // Add the reference to the entry file
  MockFs.addFiles([
    {
      path: entryFilePath(collectionEntry1),
      textContent: collectionEntry1FileContents.replace(
        'References:',
        `  - ${unresolvedAddress}\nReferences:`,
      ),
    },
  ]);

  return {
    ...serializedProperties(),
    Related: [
      resolveEntryAddress(relatedEntry1, collectionDatabase),
      resolveEntryAddress(relatedEntry2, collectionDatabase),
      unresolvedAddress,
    ],
  };
}

/**
 * Returns collectionEntry1's properties in serialized (address) form.
 */
function serializedProperties(): PropertyMap {
  return {
    ...collectionEntry1.properties,
    Related: [
      resolveEntryAddress(relatedEntry1, collectionDatabase),
      resolveEntryAddress(relatedEntry2, collectionDatabase),
    ],
    References: [resolveEntryAddress(referenceEntry1, rootStorageDatabase)],
  };
}

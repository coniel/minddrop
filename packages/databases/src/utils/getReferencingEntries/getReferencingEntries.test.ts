import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  cleanup,
  collectionEntry1,
  objectEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
} from '../../test-utils';
import { getReferencingEntries } from './getReferencingEntries';

describe('getReferencingEntries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns entries referencing the given IDs', () => {
    expect(getReferencingEntries([relatedEntry1.id])).toEqual([
      collectionEntry1,
    ]);
  });

  it('returns each referencing entry once for multiple matches', () => {
    // collectionEntry1 references both related entries
    expect(getReferencingEntries([relatedEntry1.id, relatedEntry2.id])).toEqual(
      [collectionEntry1],
    );
  });

  it('includes self-references', () => {
    // Make an entry reference itself
    DatabaseEntriesStore.update(relatedEntry1.id, {
      properties: { ...relatedEntry1.properties, Related: [relatedEntry1.id] },
    });

    const referencingIds = getReferencingEntries([relatedEntry1.id]).map(
      (entry) => entry.id,
    );

    // Both the self-reference and collectionEntry1's reference match
    expect(referencingIds.sort()).toEqual([
      collectionEntry1.id,
      relatedEntry1.id,
    ]);
  });

  it('returns nothing for unreferenced entries', () => {
    expect(getReferencingEntries([objectEntry1.id])).toEqual([]);
  });
});

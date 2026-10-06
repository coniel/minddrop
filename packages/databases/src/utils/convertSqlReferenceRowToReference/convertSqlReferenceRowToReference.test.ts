import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '../../test-utils';
import { convertSqlReferenceRowToReference } from './convertSqlReferenceRowToReference';

const { collectionEntry1, objectEntry1, relatedEntry1, relatedPropertyName } =
  DatabaseFixtures;

describe('convertSqlReferenceRowToReference', () => {
  it('converts a property reference row', () => {
    expect(
      convertSqlReferenceRowToReference({
        entry_id: collectionEntry1.id,
        kind: 'property',
        property_name: relatedPropertyName,
        target_entry_id: relatedEntry1.id,
        target_reference: null,
        fragment: null,
      }),
    ).toEqual({
      kind: 'property',
      entryId: collectionEntry1.id,
      propertyName: relatedPropertyName,
      targetEntryId: relatedEntry1.id,
    });
  });

  it('converts a wikilink row with its fragment', () => {
    expect(
      convertSqlReferenceRowToReference({
        entry_id: objectEntry1.id,
        kind: 'wikilink',
        property_name: null,
        target_entry_id: null,
        target_reference: relatedEntry1.title,
        fragment: '^abcd',
      }),
    ).toEqual({
      kind: 'wikilink',
      entryId: objectEntry1.id,
      reference: relatedEntry1.title,
      fragment: '^abcd',
    });
  });

  it('leaves out the fragment of a wikilink written without one', () => {
    expect(
      convertSqlReferenceRowToReference({
        entry_id: objectEntry1.id,
        kind: 'wikilink',
        property_name: null,
        target_entry_id: null,
        target_reference: relatedEntry1.title,
        fragment: null,
      }),
    ).toEqual({
      kind: 'wikilink',
      entryId: objectEntry1.id,
      reference: relatedEntry1.title,
    });
  });
});

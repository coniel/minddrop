import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '../../test-utils';
import { resolveEntryPropertyReferences } from './resolveEntryPropertyReferences';

const {
  collectionEntry1SqlRecord,
  notesPropertyName,
  objectEntry1,
  objectEntry1ContentPropertyRecord,
  referenceEntry1,
  referencesPropertyName,
  relatedEntry1,
  relatedEntry2,
  relatedPropertyName,
  statusProperty,
} = DatabaseFixtures;

describe('resolveEntryPropertyReferences', () => {
  it('resolves a reference for each collection value', () => {
    expect(
      resolveEntryPropertyReferences(
        collectionEntry1SqlRecord.id,
        collectionEntry1SqlRecord.properties,
      ),
    ).toEqual([
      {
        kind: 'property',
        entryId: collectionEntry1SqlRecord.id,
        propertyName: relatedPropertyName,
        targetEntryId: relatedEntry1.id,
      },
      {
        kind: 'property',
        entryId: collectionEntry1SqlRecord.id,
        propertyName: relatedPropertyName,
        targetEntryId: relatedEntry2.id,
      },
      {
        kind: 'property',
        entryId: collectionEntry1SqlRecord.id,
        propertyName: referencesPropertyName,
        targetEntryId: referenceEntry1.id,
      },
    ]);
  });

  it('resolves no references for a cleared collection value', () => {
    expect(
      resolveEntryPropertyReferences(collectionEntry1SqlRecord.id, [
        { ...collectionEntry1SqlRecord.properties[1], value: null },
      ]),
    ).toEqual([]);
  });

  it('ignores the values of a select property', () => {
    expect(
      resolveEntryPropertyReferences(objectEntry1.id, [
        {
          name: statusProperty.name,
          type: statusProperty.type,
          value: [statusProperty.options[0].value],
        },
      ]),
    ).toEqual([]);
  });

  it('resolves a reference for each wikilink in the content', () => {
    expect(
      resolveEntryPropertyReferences(objectEntry1.id, [
        {
          ...objectEntry1ContentPropertyRecord,
          value: 'See [[Book]] and [[Books/Other book#^abcd1234|a quote]].',
        },
      ]),
    ).toEqual([
      { kind: 'wikilink', entryId: objectEntry1.id, reference: 'Book' },
      {
        kind: 'wikilink',
        entryId: objectEntry1.id,
        reference: 'Books/Other book',
        fragment: '^abcd1234',
      },
    ]);
  });

  it('resolves a reference for each occurrence of a repeated wikilink', () => {
    expect(
      resolveEntryPropertyReferences(objectEntry1.id, [
        {
          ...objectEntry1ContentPropertyRecord,
          value: '[[Book]] and [[book|again]], then [[Book]]',
        },
      ]),
    ).toEqual([
      { kind: 'wikilink', entryId: objectEntry1.id, reference: 'Book' },
      { kind: 'wikilink', entryId: objectEntry1.id, reference: 'book' },
      { kind: 'wikilink', entryId: objectEntry1.id, reference: 'Book' },
    ]);
  });

  it('resolves no references for a cleared content value', () => {
    expect(
      resolveEntryPropertyReferences(objectEntry1.id, [
        { ...objectEntry1ContentPropertyRecord, value: null },
      ]),
    ).toEqual([]);
  });

  it('ignores wikilinks in properties other than the content', () => {
    expect(
      resolveEntryPropertyReferences(objectEntry1.id, [
        { name: notesPropertyName, type: 'text', value: '[[Book]]' },
      ]),
    ).toEqual([]);
  });
});

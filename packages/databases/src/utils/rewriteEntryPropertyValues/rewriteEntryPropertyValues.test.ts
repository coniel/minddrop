import { describe, expect, it } from 'vitest';
import { Properties, PropertyValue } from '@minddrop/properties';
import { DatabaseFixtures } from '../../test-utils';
import { rewriteEntryPropertyValues } from './rewriteEntryPropertyValues';

const { objectEntry1 } = DatabaseFixtures;

// An entry with two list values containing the same member
const entry = {
  ...objectEntry1,
  properties: {
    ...objectEntry1.properties,
    Tags: ['Urgent', 'Home'],
    Topics: ['Urgent'],
  },
};

/**
 * Removes 'Urgent' from a list value.
 *
 * @param value - The property value.
 * @returns The value without 'Urgent'.
 */
function removeUrgent(value: PropertyValue): PropertyValue {
  return Properties.removeValue(value, 'Urgent');
}

describe('rewriteEntryPropertyValues', () => {
  it('rewrites the values of the named properties', () => {
    const rewritten = rewriteEntryPropertyValues(
      entry,
      ['Tags', 'Topics'],
      removeUrgent,
    );

    expect(rewritten?.entry.properties).toEqual({
      ...objectEntry1.properties,
      Tags: ['Home'],
      Topics: [],
    });
  });

  it('returns a change per property whose value changed', () => {
    const rewritten = rewriteEntryPropertyValues(
      entry,
      ['Tags', 'Topics'],
      removeUrgent,
    );

    expect(rewritten?.changes).toEqual([
      { property: 'Tags', from: ['Urgent', 'Home'], to: ['Home'] },
      { property: 'Topics', from: ['Urgent'], to: [] },
    ]);
  });

  it('leaves values the rewrite did not change out of the changes', () => {
    const rewritten = rewriteEntryPropertyValues(
      { ...entry, properties: { ...entry.properties, Topics: ['Home'] } },
      ['Tags', 'Topics'],
      removeUrgent,
    );

    expect(rewritten?.changes).toEqual([
      { property: 'Tags', from: ['Urgent', 'Home'], to: ['Home'] },
    ]);
  });

  it('skips properties the entry has no value for', () => {
    const rewritten = rewriteEntryPropertyValues(
      entry,
      ['Tags', 'Missing'],
      removeUrgent,
    );

    expect(rewritten?.entry.properties).not.toHaveProperty('Missing');
  });

  it('returns null when no value changed', () => {
    expect(
      rewriteEntryPropertyValues(objectEntry1, ['Tags'], removeUrgent),
    ).toBeNull();
  });

  it('leaves the given entry untouched', () => {
    rewriteEntryPropertyValues(entry, ['Tags'], removeUrgent);

    expect(entry.properties.Tags).toEqual(['Urgent', 'Home']);
  });
});

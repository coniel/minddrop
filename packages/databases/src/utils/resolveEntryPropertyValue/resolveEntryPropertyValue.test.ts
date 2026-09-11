import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '../../test-utils';
import { resolveEntryPropertyValue } from './resolveEntryPropertyValue';

const { objectEntry1 } = DatabaseFixtures;

describe('resolveEntryPropertyValue', () => {
  it('resolves metadata backed types regardless of the name', () => {
    expect(resolveEntryPropertyValue(objectEntry1, 'Titel', 'title')).toBe(
      objectEntry1.title,
    );
  });

  it('resolves other types from the properties by name', () => {
    expect(resolveEntryPropertyValue(objectEntry1, 'Content', 'content')).toBe(
      objectEntry1.properties.Content,
    );
  });

  it('resolves undefined for a property the entry lacks', () => {
    expect(
      resolveEntryPropertyValue(objectEntry1, 'Missing', 'text'),
    ).toBeUndefined();
  });
});

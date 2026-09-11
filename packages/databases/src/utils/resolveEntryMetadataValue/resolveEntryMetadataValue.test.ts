import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '../../test-utils';
import { resolveEntryMetadataValue } from './resolveEntryMetadataValue';

const { objectEntry1 } = DatabaseFixtures;

describe('resolveEntryMetadataValue', () => {
  it('resolves the metadata backed types', () => {
    expect(resolveEntryMetadataValue(objectEntry1, 'title')).toBe(
      objectEntry1.title,
    );
    expect(resolveEntryMetadataValue(objectEntry1, 'created')).toBe(
      objectEntry1.created,
    );
    expect(resolveEntryMetadataValue(objectEntry1, 'last-modified')).toBe(
      objectEntry1.lastModified,
    );
  });

  it('resolves the colour from the entry metadata', () => {
    expect(
      resolveEntryMetadataValue(
        { ...objectEntry1, metadata: { color: 'red' } },
        'color',
      ),
    ).toBe('red');
    expect(resolveEntryMetadataValue(objectEntry1, 'color')).toBeNull();
  });

  it('resolves undefined for types not backed by metadata', () => {
    expect(resolveEntryMetadataValue(objectEntry1, 'text')).toBeUndefined();
  });
});

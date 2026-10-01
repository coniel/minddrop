import { describe, expect, it } from 'vitest';
import { objectEntry1 } from '../../test-utils';
import { DatabaseEntryMetadata } from '../../types';
import { omitEntryPropertyMetadata } from './omitEntryPropertyMetadata';

const metadata: DatabaseEntryMetadata = {
  ...objectEntry1.metadata,
  color: 'blue',
  properties: {
    Paper: { annotations: [] },
    Cover: { crop: 'square' },
  },
};

describe('omitEntryPropertyMetadata', () => {
  it("drops the named properties' metadata", () => {
    expect(omitEntryPropertyMetadata(metadata, ['Paper'])).toEqual({
      ...objectEntry1.metadata,
      color: 'blue',
      properties: { Cover: { crop: 'square' } },
    });
  });

  it('drops the properties map once it is empty', () => {
    expect(omitEntryPropertyMetadata(metadata, ['Paper', 'Cover'])).toEqual({
      ...objectEntry1.metadata,
      color: 'blue',
    });
  });

  it('returns metadata without property metadata as is', () => {
    const plain: DatabaseEntryMetadata = {
      ...objectEntry1.metadata,
      color: 'blue',
    };

    expect(omitEntryPropertyMetadata(plain, ['Paper'])).toBe(plain);
  });

  it('returns the metadata as is when the named properties have none', () => {
    expect(omitEntryPropertyMetadata(metadata, ['Photo'])).toBe(metadata);
  });
});

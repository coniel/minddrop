import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { DatabaseEntriesDataKey } from '../../constants';
import { resolveTransferredEntryIds } from './resolveTransferredEntryIds';

const { objectEntry1, urlEntry1 } = DatabaseFixtures;

describe('resolveTransferredEntryIds', () => {
  it('returns the IDs of the transferred entries', () => {
    const data = { [DatabaseEntriesDataKey]: [objectEntry1, urlEntry1] };

    expect(resolveTransferredEntryIds(data)).toEqual([
      objectEntry1.id,
      urlEntry1.id,
    ]);
  });

  it('returns an empty array when the data contains no entries', () => {
    expect(resolveTransferredEntryIds({ 'text/plain': 'Hello world' })).toEqual(
      [],
    );
  });

  it('ignores entries with no ID', () => {
    const data = {
      [DatabaseEntriesDataKey]: [{ title: 'No ID' }, objectEntry1],
    };

    expect(resolveTransferredEntryIds(data)).toEqual([objectEntry1.id]);
  });
});

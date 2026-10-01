import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { NewDatabaseEntriesDataKey } from '@minddrop/ui-databases';
import { resolveTransferredNewEntryDatabaseIds } from './resolveTransferredNewEntryDatabaseIds';

const { objectDatabase, urlDatabase } = DatabaseFixtures;

describe('resolveTransferredNewEntryDatabaseIds', () => {
  it('returns the IDs of the transferred databases', () => {
    const data = {
      [NewDatabaseEntriesDataKey]: [objectDatabase.id, urlDatabase.id],
    };

    expect(resolveTransferredNewEntryDatabaseIds(data)).toEqual([
      objectDatabase.id,
      urlDatabase.id,
    ]);
  });

  it('returns an empty array when the data contains no new entry cards', () => {
    expect(
      resolveTransferredNewEntryDatabaseIds({ 'text/plain': 'Hello world' }),
    ).toEqual([]);
  });

  it('ignores malformed database IDs', () => {
    const data = {
      [NewDatabaseEntriesDataKey]: [
        { id: objectDatabase.id },
        'not-a-database-id',
        urlDatabase.id,
      ],
    };

    expect(resolveTransferredNewEntryDatabaseIds(data)).toEqual([
      urlDatabase.id,
    ]);
  });
});

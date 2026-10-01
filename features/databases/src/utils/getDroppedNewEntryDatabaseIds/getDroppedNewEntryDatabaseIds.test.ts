import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { DragFixtures } from '@minddrop/drag-and-drop/test-utils';
import { NewDatabaseEntriesDataKey } from '@minddrop/ui-databases';
import { getDroppedNewEntryDatabaseIds } from './getDroppedNewEntryDatabaseIds';

const { objectDatabase, urlDatabase } = DatabaseFixtures;
const { dropEventData_1 } = DragFixtures;

describe('getDroppedNewEntryDatabaseIds', () => {
  it('returns the IDs of the dropped databases', () => {
    const data = {
      ...dropEventData_1,
      data: {
        [NewDatabaseEntriesDataKey]: [objectDatabase.id, urlDatabase.id],
      },
    };

    expect(getDroppedNewEntryDatabaseIds(data)).toEqual([
      objectDatabase.id,
      urlDatabase.id,
    ]);
  });

  it('returns an empty array when the drop contains no new entry cards', () => {
    expect(getDroppedNewEntryDatabaseIds(dropEventData_1)).toEqual([]);
  });

  it('ignores malformed database IDs', () => {
    const data = {
      ...dropEventData_1,
      data: {
        [NewDatabaseEntriesDataKey]: [
          { id: objectDatabase.id },
          'not-a-database-id',
          urlDatabase.id,
        ],
      },
    };

    expect(getDroppedNewEntryDatabaseIds(data)).toEqual([urlDatabase.id]);
  });
});

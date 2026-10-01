import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { DragFixtures } from '@minddrop/drag-and-drop/test-utils';
import { DatabaseEntriesDataKey } from '@minddrop/ui-databases';
import { getDroppedEntryIds } from './getDroppedEntryIds';

const { objectEntry1, urlEntry1 } = DatabaseFixtures;
const { dropEventData_1 } = DragFixtures;

describe('getDroppedEntryIds', () => {
  it('returns the IDs of the dropped entries', () => {
    const data = {
      ...dropEventData_1,
      data: { [DatabaseEntriesDataKey]: [objectEntry1, urlEntry1] },
    };

    expect(getDroppedEntryIds(data)).toEqual([objectEntry1.id, urlEntry1.id]);
  });

  it('returns an empty array when the drop contains no entries', () => {
    expect(getDroppedEntryIds(dropEventData_1)).toEqual([]);
  });

  it('ignores entries with no ID', () => {
    const data = {
      ...dropEventData_1,
      data: { [DatabaseEntriesDataKey]: [{ title: 'No ID' }, objectEntry1] },
    };

    expect(getDroppedEntryIds(data)).toEqual([objectEntry1.id]);
  });
});

import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { DropEventData } from '@minddrop/selection';
import { NewDatabaseEntriesDataKey } from '@minddrop/ui-databases';
import { getDroppedNewEntryDatabaseIds } from './getDroppedNewEntryDatabaseIds';

const { objectDatabase, urlDatabase } = DatabaseFixtures;

// Builds a drop event data object containing the given transfer data
function dropEventData(data: unknown): DropEventData {
  return {
    event: {} as React.DragEvent,
    targetType: 'board-column',
    position: 'inside',
    targetId: 'board-column-0',
    data,
  };
}

describe('getDroppedNewEntryDatabaseIds', () => {
  it('returns the IDs of the dropped databases', () => {
    const data = dropEventData({
      [NewDatabaseEntriesDataKey]: [objectDatabase.id, urlDatabase.id],
    });

    expect(getDroppedNewEntryDatabaseIds(data)).toEqual([
      objectDatabase.id,
      urlDatabase.id,
    ]);
  });

  it('returns an empty array when the drop contains no new entry cards', () => {
    const data = dropEventData({ 'text/plain': 'Hello world' });

    expect(getDroppedNewEntryDatabaseIds(data)).toEqual([]);
  });

  it('returns an empty array when the drop contains no MindDrop data', () => {
    expect(getDroppedNewEntryDatabaseIds(dropEventData(undefined))).toEqual([]);
  });

  it('ignores malformed database IDs', () => {
    const data = dropEventData({
      [NewDatabaseEntriesDataKey]: [
        { id: objectDatabase.id },
        'not-a-database-id',
        urlDatabase.id,
      ],
    });

    expect(getDroppedNewEntryDatabaseIds(data)).toEqual([urlDatabase.id]);
  });
});

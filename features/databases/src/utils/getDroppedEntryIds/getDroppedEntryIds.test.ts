import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { DropEventData } from '@minddrop/selection';
import { DatabaseEntriesDataKey } from '@minddrop/ui-databases';
import { getDroppedEntryIds } from './getDroppedEntryIds';

const { objectEntry1, urlEntry1 } = DatabaseFixtures;

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

describe('getDroppedEntryIds', () => {
  it('returns the IDs of the dropped entries', () => {
    const data = dropEventData({
      [DatabaseEntriesDataKey]: [objectEntry1, urlEntry1],
    });

    expect(getDroppedEntryIds(data)).toEqual([objectEntry1.id, urlEntry1.id]);
  });

  it('returns an empty array when the drop contains no entries', () => {
    const data = dropEventData({ 'text/plain': 'Hello world' });

    expect(getDroppedEntryIds(data)).toEqual([]);
  });

  it('returns an empty array when the drop contains no MindDrop data', () => {
    expect(getDroppedEntryIds(dropEventData(undefined))).toEqual([]);
  });

  it('ignores entries with no ID', () => {
    const data = dropEventData({
      [DatabaseEntriesDataKey]: [{ title: 'No ID' }, objectEntry1],
    });

    expect(getDroppedEntryIds(data)).toEqual([objectEntry1.id]);
  });
});

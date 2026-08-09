import { describe, expect, it } from 'vitest';
import { DropEventData } from '@minddrop/selection';
import { NewEntryPickerDataKey } from '../../constants';
import { dropContainsNewEntryPickerCard } from './dropContainsNewEntryPickerCard';

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

describe('dropContainsNewEntryPickerCard', () => {
  it('returns true when the drop contains a new entry card', () => {
    const data = dropEventData({ [NewEntryPickerDataKey]: true });

    expect(dropContainsNewEntryPickerCard(data)).toBe(true);
  });

  it('returns false when the drop contains no new entry card', () => {
    const data = dropEventData({ 'text/plain': 'Hello world' });

    expect(dropContainsNewEntryPickerCard(data)).toBe(false);
  });

  it('returns false when the drop contains no MindDrop data', () => {
    expect(dropContainsNewEntryPickerCard(dropEventData(undefined))).toBe(
      false,
    );
  });
});

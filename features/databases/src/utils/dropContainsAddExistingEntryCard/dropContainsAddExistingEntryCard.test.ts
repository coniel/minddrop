import { describe, expect, it } from 'vitest';
import { DropEventData } from '@minddrop/selection';
import { AddExistingEntryDataKey } from '@minddrop/ui-databases';
import { dropContainsAddExistingEntryCard } from './dropContainsAddExistingEntryCard';

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

describe('dropContainsAddExistingEntryCard', () => {
  it('returns true when the drop contains an add existing entry card', () => {
    const data = dropEventData({ [AddExistingEntryDataKey]: true });

    expect(dropContainsAddExistingEntryCard(data)).toBe(true);
  });

  it('returns false when the drop contains no add existing entry card', () => {
    const data = dropEventData({ 'text/plain': 'Hello world' });

    expect(dropContainsAddExistingEntryCard(data)).toBe(false);
  });

  it('returns false when the drop contains no MindDrop data', () => {
    expect(dropContainsAddExistingEntryCard(dropEventData(undefined))).toBe(
      false,
    );
  });
});

import { describe, expect, it } from 'vitest';
import { DropEventData } from '@minddrop/selection';
import { AddContentDataKey } from '@minddrop/ui-databases';
import { dropContainsAddContentCard } from './dropContainsAddContentCard';

// Builds a drop event data object containing the given transfer data
function dropEventData(data: unknown): DropEventData {
  return {
    origin: null,
    clientX: 0,
    clientY: 0,
    targetType: 'board-column',
    position: 'inside',
    targetId: 'board-column-0',
    data,
  };
}

describe('dropContainsAddContentCard', () => {
  it('returns true when the drop contains an add content card', () => {
    const data = dropEventData({ [AddContentDataKey]: true });

    expect(dropContainsAddContentCard(data)).toBe(true);
  });

  it('returns false when the drop contains no add content card', () => {
    const data = dropEventData({ 'text/plain': 'Hello world' });

    expect(dropContainsAddContentCard(data)).toBe(false);
  });

  it('returns false when the drop contains no MindDrop data', () => {
    expect(dropContainsAddContentCard(dropEventData(undefined))).toBe(false);
  });
});

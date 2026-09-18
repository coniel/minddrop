import { describe, expect, it } from 'vitest';
import { LayoutBoxFixtures } from '@minddrop/designs-next/test-utils';
import { resolveLayoutBoxKey } from './resolveLayoutBoxKey';

const { layoutBox_gap, layoutBox_iconColumn, layoutBox_text } =
  LayoutBoxFixtures;

describe('resolveLayoutBoxKey', () => {
  it('keys an element box by its element', () => {
    expect(resolveLayoutBoxKey(layoutBox_text)).toBe(layoutBox_text.element.id);
  });

  it('keys boxes of one type apart by their position', () => {
    // The gap and a second gap at the region's left edge
    expect(resolveLayoutBoxKey(layoutBox_gap)).not.toBe(
      resolveLayoutBoxKey({ ...layoutBox_gap, column: 0 }),
    );
  });

  it('keys boxes of different types apart at the same position', () => {
    expect(resolveLayoutBoxKey(layoutBox_gap)).not.toBe(
      resolveLayoutBoxKey({
        ...layoutBox_iconColumn,
        column: layoutBox_gap.column,
      }),
    );
  });
});

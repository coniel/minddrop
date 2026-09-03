import { describe, expect, it } from 'vitest';
import { UnitPixelSize } from '../../constants';
import {
  blockElements,
  cardColumns,
  coverElement,
  iconElement,
  titleElement,
} from '../../test-utils';
import { resolveElementRect } from './resolveElementRect';

describe('resolveElementRect', () => {
  it('scales a full-width fluid element to the card width', () => {
    const rect = resolveElementRect(
      coverElement,
      blockElements,
      cardColumns,
      480,
    );

    expect(rect).toEqual({ left: 0, width: 480 });
  });

  it('keeps the gaps around a fixed element at their unit width', () => {
    const rect = resolveElementRect(
      iconElement,
      blockElements,
      cardColumns,
      480,
    );

    // The icon keeps its unit width, and the 2-unit gap between it and
    // the card's right edge keeps its width, pinning it near the edge
    expect(rect.width).toBe(iconElement.columnSpan * UnitPixelSize);
    expect(rect.left).toBeCloseTo(
      480 - (48 - iconElement.column) * UnitPixelSize,
    );
  });

  it('ignores layered elements when sizing', () => {
    const withCover = resolveElementRect(
      titleElement,
      blockElements,
      cardColumns,
      480,
    );
    const alone = resolveElementRect(
      titleElement,
      [titleElement, iconElement],
      cardColumns,
      480,
    );

    // The cover overlaps the title on both axes, so it does not
    // constrain the title's rect
    expect(withCover).toEqual(alone);
  });

  it('pins a fixed element without fluid neighbours to its edge', () => {
    const rect = resolveElementRect(
      iconElement,
      [iconElement],
      cardColumns,
      480,
    );

    // The gap to the element's left absorbs all extra space
    expect(rect.width).toBe(iconElement.columnSpan * UnitPixelSize);
    expect(rect.left).toBeCloseTo(
      480 - (48 - iconElement.column) * UnitPixelSize,
    );
  });

  it('keeps a symmetrically placed centered element centered', () => {
    const centeredElement = {
      ...iconElement,
      widthMode: 'fixed-center' as const,
      column: 21,
    };
    const rect = resolveElementRect(
      centeredElement,
      [centeredElement],
      cardColumns,
      480,
    );

    // Both side gaps absorb the space equally
    expect(rect.width).toBe(centeredElement.columnSpan * UnitPixelSize);
    expect(rect.left).toBeCloseTo((480 - rect.width) / 2);
  });

  it('floors scaling columns at zero width', () => {
    const rect = resolveElementRect(
      titleElement,
      [titleElement],
      cardColumns,
      // Narrower than the fixed columns' total width
      40,
    );

    expect(rect.width).toBe(0);
  });
});

import { describe, expect, it } from 'vitest';
import { UnitPixelSize } from '../../constants';
import { coverDesignElement, iconDesignElement } from '../../test-utils';
import { DesignElement } from '../../types';
import { resolveVerticalElementRect } from './resolveVerticalElementRect';

// A fluid-height element across every row
const fullHeightElement: DesignElement = {
  ...coverDesignElement,
  rowSpan: 32,
  heightMode: 'fluid',
};

// A bottom-pinned bar across the design's width in rows 26-31
const bottomBar: DesignElement = {
  ...iconDesignElement,
  column: 0,
  columnSpan: 48,
  row: 26,
  rowSpan: 6,
  heightMode: 'fixed-bottom',
};

describe('resolveVerticalElementRect', () => {
  it('scales a full-height fluid element to the card height', () => {
    const rect = resolveVerticalElementRect(
      fullHeightElement,
      [fullHeightElement],
      32,
      256,
    );

    expect(rect).toEqual({ top: 0, height: 256 });
  });

  it('keeps a pinned element at its unit height near its edge', () => {
    // A fluid cover above the bottom-pinned bar
    const cover: DesignElement = {
      ...coverDesignElement,
      heightMode: 'fluid',
    };
    const rect = resolveVerticalElementRect(
      bottomBar,
      [cover, bottomBar],
      32,
      256,
    );

    // The bar keeps its unit height, and the gap between it and the
    // card's bottom edge keeps its height, pinning it near the edge.
    expect(rect.height).toBe(bottomBar.rowSpan * UnitPixelSize);
    expect(rect.top).toBeCloseTo(256 - (32 - bottomBar.row) * UnitPixelSize);
  });

  it('pins a fixed element without fluid neighbours to its edge', () => {
    const rect = resolveVerticalElementRect(bottomBar, [bottomBar], 32, 256);

    // The gap above the element absorbs all extra space
    expect(rect.height).toBe(bottomBar.rowSpan * UnitPixelSize);
    expect(rect.top).toBeCloseTo(256 - (32 - bottomBar.row) * UnitPixelSize);
  });

  it('ignores layered elements when sizing', () => {
    // A title layered over the full-height element
    const layered: DesignElement = {
      ...iconDesignElement,
      id: 'element_layered',
      column: 0,
      columnSpan: 48,
      row: 4,
      rowSpan: 6,
      heightMode: 'fixed-top',
    };
    const withLayered = resolveVerticalElementRect(
      fullHeightElement,
      [fullHeightElement, layered],
      32,
      256,
    );
    const alone = resolveVerticalElementRect(
      fullHeightElement,
      [fullHeightElement],
      32,
      256,
    );

    expect(withLayered).toEqual(alone);
  });

  it('compresses gap rows before pinned element rows', () => {
    // Two chained top-pinned bars in rows 0-5 and 8-13, leaving a
    // fixed two-row gap between them.
    const firstBar: DesignElement = {
      ...bottomBar,
      id: 'element_first',
      row: 0,
      heightMode: 'fixed-top',
    };
    const secondBar: DesignElement = {
      ...bottomBar,
      id: 'element_second',
      row: 8,
      heightMode: 'fixed-top',
    };

    // At 50px the fixed rows total 56px: the gap compresses to 1px
    // per row while both bars keep their full unit heights.
    const rect = resolveVerticalElementRect(
      secondBar,
      [firstBar, secondBar],
      32,
      50,
    );

    expect(rect.height).toBe(secondBar.rowSpan * UnitPixelSize);
    expect(rect.top).toBe(firstBar.rowSpan * UnitPixelSize + 2);
  });

  it('compresses fixed rows once the card is shorter than their total', () => {
    // The bar's six fixed rows total 24px against a 12px card, so
    // every fixed row compresses to 2px and the ratio holds.
    const rect = resolveVerticalElementRect(bottomBar, [bottomBar], 32, 12);

    expect(rect.height).toBe(12);
    expect(rect.top).toBe(0);
  });

  it('floors scaling rows at zero height', () => {
    const rect = resolveVerticalElementRect(
      fullHeightElement,
      [fullHeightElement],
      32,
      // Shorter than the fixed rows' total height
      0,
    );

    expect(rect.height).toBe(0);
  });
});

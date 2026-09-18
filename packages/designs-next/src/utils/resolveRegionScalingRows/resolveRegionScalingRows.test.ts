import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { resolveRegionScalingRows } from './resolveRegionScalingRows';

const { designElement_bottomBar, designElement_fluidCover } =
  DesignElementFixtures;

describe('resolveRegionScalingRows', () => {
  it('returns a flag per row of the region', () => {
    const scaling = resolveRegionScalingRows([designElement_fluidCover], {
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 32,
    });

    // The cover's rows scale, the gap below it stays fixed
    expect(scaling).toHaveLength(32);
    expect(scaling[0]).toBe(true);
    expect(scaling[designElement_fluidCover.rowSpan]).toBe(false);
  });

  it('counts the flags from the region top edge', () => {
    // The bottom-pinned bar in a region starting at row 16
    const scaling = resolveRegionScalingRows([designElement_bottomBar], {
      column: 0,
      row: 16,
      columnSpan: 48,
      rowSpan: 16,
    });

    // The gap above the bar scales, the bar's rows do not
    expect(scaling).toHaveLength(16);
    expect(scaling[0]).toBe(true);
    expect(scaling[designElement_bottomBar.row - 16]).toBe(false);
  });
});

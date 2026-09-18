import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { resolveRegionScalingColumns } from './resolveRegionScalingColumns';

const { iconDesignElement, titleDesignElement } = DesignElementFixtures;

describe('resolveRegionScalingColumns', () => {
  it('returns a flag per column of the region', () => {
    const scaling = resolveRegionScalingColumns([titleDesignElement], {
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 16,
    });

    // The title's columns scale, the gaps beside it stay fixed
    expect(scaling).toHaveLength(48);
    expect(scaling[titleDesignElement.column - 1]).toBe(false);
    expect(scaling[titleDesignElement.column]).toBe(true);
  });

  it('counts the flags from the region left edge', () => {
    // The right-pinned icon in a region starting at column 32
    const scaling = resolveRegionScalingColumns([iconDesignElement], {
      column: 32,
      row: 0,
      columnSpan: 16,
      rowSpan: 16,
    });

    // The gap left of the icon scales, the icon's columns do not
    expect(scaling).toHaveLength(16);
    expect(scaling[0]).toBe(true);
    expect(scaling[iconDesignElement.column - 32]).toBe(false);
  });
});

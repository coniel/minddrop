import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { DesignElement, LayoutRegion } from '../../types';
import { resolveElementRowUnits } from './resolveElementRowUnits';

const { coverDesignElement, iconDesignElement, titleDesignElement } =
  DesignElementFixtures;

// The band the cover and title share
const coverBand: LayoutRegion = {
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 16,
};

// A bar pinned to the bottom of the band, in its last four rows
const bottomBar: DesignElement = {
  ...iconDesignElement,
  column: 0,
  columnSpan: 48,
  row: 12,
  rowSpan: 4,
  heightMode: 'fixed-bottom',
};

describe('resolveElementRowUnits', () => {
  it('holds a top-pinned element at its unit height from the top', () => {
    // The title alone in its context, the cover layered under it
    // ignored: its rows stay fixed and the gap below it scales.
    expect(
      resolveElementRowUnits(
        titleDesignElement,
        [coverDesignElement, titleDesignElement],
        coverBand,
      ),
    ).toEqual({
      before: { fixed: 10, scaling: 0 },
      span: { fixed: 4, scaling: 0 },
      total: { fixed: 14, scaling: 2 },
    });
  });

  it('gives a bottom-pinned element a scaling gap above it', () => {
    expect(resolveElementRowUnits(bottomBar, [bottomBar], coverBand)).toEqual({
      before: { fixed: 0, scaling: 12 },
      span: { fixed: 4, scaling: 0 },
      total: { fixed: 4, scaling: 12 },
    });
  });

  it('scales a fluid-height element across its rows', () => {
    const cover: DesignElement = { ...coverDesignElement, heightMode: 'fluid' };

    expect(
      resolveElementRowUnits(cover, [cover, bottomBar], coverBand),
    ).toEqual({
      before: { fixed: 0, scaling: 0 },
      span: { fixed: 0, scaling: 16 },
      total: { fixed: 0, scaling: 16 },
    });
  });

  it('counts the units from the region top edge', () => {
    // The bar inside a region starting at row 8
    expect(
      resolveElementRowUnits(bottomBar, [bottomBar], {
        ...coverBand,
        row: 8,
        rowSpan: 8,
      }),
    ).toEqual({
      before: { fixed: 0, scaling: 4 },
      span: { fixed: 4, scaling: 0 },
      total: { fixed: 4, scaling: 4 },
    });
  });
});

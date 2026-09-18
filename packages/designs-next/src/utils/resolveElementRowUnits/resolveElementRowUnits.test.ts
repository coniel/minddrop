import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { DesignElement, LayoutRegion } from '../../types';
import { resolveElementRowUnits } from './resolveElementRowUnits';

const {
  coverDesignElement,
  designElement_bottomBar,
  designElement_fluidCover,
  titleDesignElement,
} = DesignElementFixtures;

// The band the cover and title share
const coverBand: LayoutRegion = {
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 16,
};

// The bottom bar moved into the band's last four rows
const bar: DesignElement = {
  ...designElement_bottomBar,
  row: 12,
  rowSpan: 4,
};

describe('resolveElementRowUnits', () => {
  it('holds a top-pinned element at its unit height from the top', () => {
    // The cover layered under the title is ignored, so the title is
    // alone in its context. Its rows stay fixed and the gap below it
    // scales.
    expect(
      resolveElementRowUnits(
        titleDesignElement,
        [coverDesignElement, titleDesignElement],
        coverBand,
      ),
    ).toEqual({
      before: { fixed: titleDesignElement.row, scaling: 0 },
      span: { fixed: titleDesignElement.rowSpan, scaling: 0 },
      total: { fixed: 14, scaling: 2 },
    });
  });

  it('gives a bottom-pinned element a scaling gap above it', () => {
    expect(resolveElementRowUnits(bar, [bar], coverBand)).toEqual({
      before: { fixed: 0, scaling: bar.row },
      span: { fixed: bar.rowSpan, scaling: 0 },
      total: { fixed: bar.rowSpan, scaling: bar.row },
    });
  });

  it('scales a fluid-height element across its rows', () => {
    expect(
      resolveElementRowUnits(
        designElement_fluidCover,
        [designElement_fluidCover, bar],
        coverBand,
      ),
    ).toEqual({
      before: { fixed: 0, scaling: 0 },
      span: { fixed: 0, scaling: designElement_fluidCover.rowSpan },
      total: { fixed: 0, scaling: designElement_fluidCover.rowSpan },
    });
  });

  it('counts the units from the region top edge', () => {
    // The bar inside a region starting at row 8
    expect(
      resolveElementRowUnits(bar, [bar], { ...coverBand, row: 8, rowSpan: 8 }),
    ).toEqual({
      before: { fixed: 0, scaling: 4 },
      span: { fixed: bar.rowSpan, scaling: 0 },
      total: { fixed: bar.rowSpan, scaling: 4 },
    });
  });
});

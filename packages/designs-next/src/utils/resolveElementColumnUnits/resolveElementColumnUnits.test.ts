import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { LayoutRegion } from '../../types';
import { resolveElementColumnUnits } from './resolveElementColumnUnits';

const { coverDesignElement, iconDesignElement, titleDesignElement } =
  DesignElementFixtures;

// The band the cover, title and icon share
const coverBand: LayoutRegion = {
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 16,
};

describe('resolveElementColumnUnits', () => {
  it('scales a fluid element across its columns and fixes its gaps', () => {
    // The title spans columns 2-29 alone in its context, the cover
    // layered under it ignored.
    expect(
      resolveElementColumnUnits(
        titleDesignElement,
        [coverDesignElement, titleDesignElement],
        coverBand,
      ),
    ).toEqual({
      before: { fixed: 2, scaling: 0 },
      span: { fixed: 0, scaling: 28 },
      total: { fixed: 20, scaling: 28 },
    });
  });

  it('keeps a fixed element at its unit width beside a fluid one', () => {
    // The icon sits right of the title, which absorbs the width
    expect(
      resolveElementColumnUnits(
        iconDesignElement,
        [titleDesignElement, iconDesignElement],
        coverBand,
      ),
    ).toEqual({
      before: { fixed: 12, scaling: 28 },
      span: { fixed: 6, scaling: 0 },
      total: { fixed: 20, scaling: 28 },
    });
  });

  it('gives a pinned element a scaling gap on its unpinned side', () => {
    // The right-pinned icon alone: the gap to its left scales
    expect(
      resolveElementColumnUnits(
        iconDesignElement,
        [iconDesignElement],
        coverBand,
      ),
    ).toEqual({
      before: { fixed: 0, scaling: 40 },
      span: { fixed: 6, scaling: 0 },
      total: { fixed: 8, scaling: 40 },
    });
  });

  it('counts the units from the region left edge', () => {
    // The icon inside a region starting at column 32
    expect(
      resolveElementColumnUnits(iconDesignElement, [iconDesignElement], {
        ...coverBand,
        column: 32,
        columnSpan: 16,
      }),
    ).toEqual({
      before: { fixed: 0, scaling: 8 },
      span: { fixed: 6, scaling: 0 },
      total: { fixed: 8, scaling: 8 },
    });
  });
});

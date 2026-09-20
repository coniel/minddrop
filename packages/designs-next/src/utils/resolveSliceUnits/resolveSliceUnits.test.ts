import { describe, expect, it } from 'vitest';
import { LayoutRegion } from '../../types';
import { resolveSliceUnits } from './resolveSliceUnits';

// A region of eight columns and four rows at the grid's origin
const region: LayoutRegion = { column: 0, row: 0, columnSpan: 8, rowSpan: 4 };

// Columns two to five scale, the rest keep their width
const columnScaling = [false, false, true, true, true, true, false, false];

// The last row scales
const rowScaling = [false, false, false, true];

describe('resolveSliceUnits', () => {
  it('counts the columns and rows a slice spans by whether they scale', () => {
    // The slice covers columns one to four and rows two to three
    expect(
      resolveSliceUnits(
        { column: 1, row: 2, columnSpan: 4, rowSpan: 2 },
        columnScaling,
        rowScaling,
        region,
      ),
    ).toEqual({
      columnUnits: { fixed: 1, scaling: 3 },
      rowUnits: { fixed: 1, scaling: 1 },
    });
  });

  it('counts from the region origin', () => {
    // The same slice inside a region starting at column 4, row 8
    expect(
      resolveSliceUnits(
        { column: 5, row: 10, columnSpan: 4, rowSpan: 2 },
        columnScaling,
        rowScaling,
        { ...region, column: 4, row: 8 },
      ),
    ).toEqual({
      columnUnits: { fixed: 1, scaling: 3 },
      rowUnits: { fixed: 1, scaling: 1 },
    });
  });
});

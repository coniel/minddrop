import { describe, expect, it } from 'vitest';
import { LayoutRegion } from '../../types';
import { sliceRegion } from './sliceRegion';

const region: LayoutRegion = { column: 4, row: 2, columnSpan: 40, rowSpan: 20 };

describe('sliceRegion', () => {
  it('slices the region into bands at horizontal lines', () => {
    expect(sliceRegion(region, [8, 16], 'rows')).toEqual([
      { column: 4, row: 2, columnSpan: 40, rowSpan: 6 },
      { column: 4, row: 8, columnSpan: 40, rowSpan: 8 },
      { column: 4, row: 16, columnSpan: 40, rowSpan: 6 },
    ]);
  });

  it('slices the region into columns at vertical lines', () => {
    expect(sliceRegion(region, [10], 'columns')).toEqual([
      { column: 4, row: 2, columnSpan: 6, rowSpan: 20 },
      { column: 10, row: 2, columnSpan: 34, rowSpan: 20 },
    ]);
  });

  it('returns the whole region without lines', () => {
    expect(sliceRegion(region, [], 'rows')).toEqual([region]);
  });
});

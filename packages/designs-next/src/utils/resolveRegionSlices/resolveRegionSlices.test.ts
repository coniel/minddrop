import { describe, expect, it } from 'vitest';
import { DesignElementFixtures, DesignFixtures } from '../../test-utils';
import { LayoutRegion } from '../../types';
import { resolveRegionSlices } from './resolveRegionSlices';

const { design_iconsBesideText } = DesignFixtures;
const {
  designElement_besideIcon_1,
  designElement_besideIcon_2,
  designElement_besideIcon_3,
  designElement_besideText,
} = DesignElementFixtures;

// The whole icons beside text design
const region: LayoutRegion = {
  column: 0,
  row: 0,
  columnSpan: design_iconsBesideText.columns,
  rowSpan: design_iconsBesideText.rows,
};

describe('resolveRegionSlices', () => {
  it('gives each slice the elements inside it', () => {
    const slices = resolveRegionSlices(
      region,
      design_iconsBesideText.elements,
      [designElement_besideIcon_1.columnSpan, designElement_besideText.column],
      'columns',
    );

    expect(slices.map((slice) => slice.elements)).toEqual([
      [
        designElement_besideIcon_1,
        designElement_besideIcon_2,
        designElement_besideIcon_3,
      ],
      [],
      [designElement_besideText],
    ]);
  });

  it('sizes each slice against the region elements', () => {
    const slices = resolveRegionSlices(
      region,
      design_iconsBesideText.elements,
      [designElement_besideIcon_1.columnSpan, designElement_besideText.column],
      'columns',
    );

    // The icon column and the gap keep their width, the text scales
    expect(slices.map((slice) => slice.units.columnUnits)).toEqual([
      { fixed: designElement_besideIcon_1.columnSpan, scaling: 0 },
      { fixed: 2, scaling: 0 },
      { fixed: 0, scaling: designElement_besideText.columnSpan },
    ]);
  });

  it('slices along the rows', () => {
    // The icon column cut between its first icon and the gap below
    const slices = resolveRegionSlices(
      { ...region, columnSpan: designElement_besideIcon_1.columnSpan },
      [designElement_besideIcon_1, designElement_besideIcon_2],
      [designElement_besideIcon_1.rowSpan],
      'rows',
    );

    expect(slices.map((slice) => slice.region.rowSpan)).toEqual([
      designElement_besideIcon_1.rowSpan,
      region.rowSpan - designElement_besideIcon_1.rowSpan,
    ]);
    expect(slices[0].elements).toEqual([designElement_besideIcon_1]);
  });
});

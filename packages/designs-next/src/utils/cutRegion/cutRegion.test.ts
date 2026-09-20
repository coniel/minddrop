import { describe, expect, it } from 'vitest';
import { DesignElementFixtures, DesignFixtures } from '../../test-utils';
import { LayoutBoxUnits, LayoutRegion } from '../../types';
import { cutRegion } from './cutRegion';

const { design_pinwheel, design_stacked } = DesignFixtures;
const { designElement_stackedHeading } = DesignElementFixtures;

// The whole fixture card
const region: LayoutRegion = { column: 0, row: 0, columnSpan: 48, rowSpan: 32 };

// The units a caller hands the region, carried onto the box
const units: LayoutBoxUnits = {
  columnUnits: { fixed: 0, scaling: 48 },
  rowUnits: { fixed: 32, scaling: 0 },
};

describe('cutRegion', () => {
  it('compiles a region with no element to a spacer', () => {
    expect(cutRegion(region, [], units)).toEqual({
      type: 'spacer',
      ...region,
      ...units,
    });
  });

  it('compiles a region one element fills to that element', () => {
    const headingRegion: LayoutRegion = {
      ...region,
      rowSpan: designElement_stackedHeading.rowSpan,
    };

    expect(
      cutRegion(headingRegion, [designElement_stackedHeading], units),
    ).toEqual({
      type: 'element',
      ...headingRegion,
      ...units,
      element: designElement_stackedHeading,
    });
  });

  it('cuts a region into bands, each cut in turn', () => {
    const box = cutRegion(region, design_stacked.elements, units);

    // The stacked heading, body, gap and footer
    expect(box.type).toBe('rows');
    expect(
      box.type === 'rows' && box.children.map((child) => child.type),
    ).toEqual(['element', 'element', 'spacer', 'element']);
  });

  it('compiles a region no line cuts to an atom', () => {
    expect(cutRegion(region, design_pinwheel.elements, units)).toEqual({
      type: 'atom',
      ...region,
      ...units,
      elements: design_pinwheel.elements,
    });
  });
});

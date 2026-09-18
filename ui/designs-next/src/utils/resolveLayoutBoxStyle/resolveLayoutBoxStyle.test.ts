import { describe, expect, it } from 'vitest';
import { Designs, LayoutBox } from '@minddrop/designs-next';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { resolveLayoutBoxStyle } from './resolveLayoutBoxStyle';

const { designElement_besideIcon_1, designElement_besideText } =
  DesignElementFixtures;

// A fixed gap of two columns
const gap: LayoutBox = {
  type: 'spacer',
  column: 6,
  row: 0,
  columnSpan: 2,
  rowSpan: 22,
  columnUnits: { fixed: 2, scaling: 0 },
  rowUnits: { fixed: 22, scaling: 0 },
};

// The fluid text filling the rest of the width
const text: LayoutBox = {
  type: 'element',
  column: 8,
  row: 0,
  columnSpan: 40,
  rowSpan: 22,
  columnUnits: { fixed: 0, scaling: 40 },
  rowUnits: { fixed: 22, scaling: 0 },
  element: designElement_besideText,
};

// The icon column, uncut
const icons: LayoutBox = {
  type: 'atom',
  column: 0,
  row: 0,
  columnSpan: 6,
  rowSpan: 22,
  columnUnits: { fixed: 6, scaling: 0 },
  rowUnits: { fixed: 22, scaling: 0 },
  elements: [designElement_besideIcon_1],
};

// A band of a fixed-height design with ten fixed rows and six
// scaling ones.
const mixedBand: LayoutBox = {
  ...gap,
  rowUnits: { fixed: 10, scaling: 6 },
};

describe('resolveLayoutBoxStyle', () => {
  it('grows a box in a column box by its scaling columns', () => {
    expect(resolveLayoutBoxStyle(text, 'columns', false)).toMatchObject({
      flexGrow: 40,
      flexBasis: 0,
    });
  });

  it('bases a box in a column box on its fixed columns', () => {
    expect(resolveLayoutBoxStyle(gap, 'columns', false)).toMatchObject({
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 2 * Designs.constants.UnitPixelSize,
    });
  });

  it('leaves the width of a band to its rows box', () => {
    expect(resolveLayoutBoxStyle(text, 'rows', false).flexGrow).toBeUndefined();
  });

  it('gives a spacer band its unit height', () => {
    expect(resolveLayoutBoxStyle(gap, 'rows', false)).toEqual({
      height: 22 * Designs.constants.UnitPixelSize,
    });
  });

  it('gives a spacer at the root its unit height', () => {
    expect(resolveLayoutBoxStyle(gap, null, false)).toEqual({
      height: 22 * Designs.constants.UnitPixelSize,
    });
  });

  it('stretches a spacer column to its column box', () => {
    expect(resolveLayoutBoxStyle(gap, 'columns', false).height).toBeUndefined();
  });

  it('bounds an element by its content fit', () => {
    expect(resolveLayoutBoxStyle(text, 'columns', false).minHeight).toBe(
      22 * Designs.constants.UnitPixelSize,
    );
  });

  it('gives an atomic box its unit height as a minimum', () => {
    expect(resolveLayoutBoxStyle(icons, 'columns', false).minHeight).toBe(
      22 * Designs.constants.UnitPixelSize,
    );
  });

  it('gives a band under a fixed height its flex share of the rows', () => {
    expect(resolveLayoutBoxStyle(mixedBand, 'rows', true)).toEqual({
      flexGrow: 6,
      flexShrink: 1,
      flexBasis: 10 * Designs.constants.UnitPixelSize,
      minHeight: 0,
    });
  });

  it('ignores the content fit under a fixed height', () => {
    expect(resolveLayoutBoxStyle(text, 'rows', true).minHeight).toBe(0);
    expect(
      resolveLayoutBoxStyle(text, 'columns', true).minHeight,
    ).toBeUndefined();
  });

  it('stretches a column box under a fixed height to its band', () => {
    expect(resolveLayoutBoxStyle(icons, 'columns', true)).toEqual({
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 6 * Designs.constants.UnitPixelSize,
    });
  });

  it('leaves the root under a fixed height to fill the render', () => {
    expect(resolveLayoutBoxStyle(mixedBand, null, true)).toEqual({});
  });
});

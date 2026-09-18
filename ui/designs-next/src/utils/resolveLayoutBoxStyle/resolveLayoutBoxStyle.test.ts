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
};

// The fluid text filling the rest of the width
const text: LayoutBox = {
  type: 'element',
  column: 8,
  row: 0,
  columnSpan: 40,
  rowSpan: 22,
  columnUnits: { fixed: 0, scaling: 40 },
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
  elements: [designElement_besideIcon_1],
};

describe('resolveLayoutBoxStyle', () => {
  it('grows a box in a column box by its scaling columns', () => {
    expect(resolveLayoutBoxStyle(text, 'columns')).toMatchObject({
      flexGrow: 40,
      flexBasis: 0,
    });
  });

  it('bases a box in a column box on its fixed columns', () => {
    expect(resolveLayoutBoxStyle(gap, 'columns')).toMatchObject({
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 2 * Designs.constants.UnitPixelSize,
    });
  });

  it('leaves the width of a band to its rows box', () => {
    expect(resolveLayoutBoxStyle(text, 'rows').flexGrow).toBeUndefined();
  });

  it('gives a spacer band its unit height', () => {
    expect(resolveLayoutBoxStyle(gap, 'rows')).toEqual({
      height: 22 * Designs.constants.UnitPixelSize,
    });
  });

  it('stretches a spacer column to its column box', () => {
    expect(resolveLayoutBoxStyle(gap, 'columns').height).toBeUndefined();
  });

  it('bounds an element by its content fit', () => {
    expect(resolveLayoutBoxStyle(text, 'columns').minHeight).toBe(
      22 * Designs.constants.UnitPixelSize,
    );
  });

  it('gives an atomic box its unit height as a minimum', () => {
    expect(resolveLayoutBoxStyle(icons, 'columns').minHeight).toBe(
      22 * Designs.constants.UnitPixelSize,
    );
  });
});

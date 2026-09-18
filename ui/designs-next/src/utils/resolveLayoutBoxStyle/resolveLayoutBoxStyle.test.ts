import { describe, expect, it } from 'vitest';
import { Designs, LayoutBox } from '@minddrop/designs-next';
import { LayoutBoxFixtures } from '@minddrop/designs-next/test-utils';
import { resolveLayoutBoxStyle } from './resolveLayoutBoxStyle';

const { layoutBox_gap, layoutBox_iconColumn, layoutBox_text } =
  LayoutBoxFixtures;

// The gap as a band of a fixed-height design, with ten fixed rows
// and six scaling ones.
const mixedBand: LayoutBox = {
  ...layoutBox_gap,
  rowUnits: { fixed: 10, scaling: 6 },
};

describe('resolveLayoutBoxStyle', () => {
  it('grows a box in a column box by its scaling columns', () => {
    expect(
      resolveLayoutBoxStyle(layoutBox_text, 'columns', false),
    ).toMatchObject({
      flexGrow: layoutBox_text.columnUnits.scaling,
      flexBasis: 0,
    });
  });

  it('bases a box in a column box on its fixed columns', () => {
    expect(
      resolveLayoutBoxStyle(layoutBox_gap, 'columns', false),
    ).toMatchObject({
      flexGrow: 0,
      flexShrink: 0,
      flexBasis:
        layoutBox_gap.columnUnits.fixed * Designs.constants.UnitPixelSize,
    });
  });

  it('leaves the width of a band to its rows box', () => {
    expect(
      resolveLayoutBoxStyle(layoutBox_text, 'rows', false).flexGrow,
    ).toBeUndefined();
  });

  it('gives a spacer band its unit height', () => {
    expect(resolveLayoutBoxStyle(layoutBox_gap, 'rows', false)).toEqual({
      height: layoutBox_gap.rowSpan * Designs.constants.UnitPixelSize,
    });
  });

  it('gives a spacer at the root its unit height', () => {
    expect(resolveLayoutBoxStyle(layoutBox_gap, null, false)).toEqual({
      height: layoutBox_gap.rowSpan * Designs.constants.UnitPixelSize,
    });
  });

  it('stretches a spacer column to its column box', () => {
    expect(
      resolveLayoutBoxStyle(layoutBox_gap, 'columns', false).height,
    ).toBeUndefined();
  });

  it('bounds an element by its content fit', () => {
    expect(
      resolveLayoutBoxStyle(layoutBox_text, 'columns', false).minHeight,
    ).toBe(layoutBox_text.rowSpan * Designs.constants.UnitPixelSize);
  });

  it('gives an atomic box its unit height as a minimum', () => {
    expect(
      resolveLayoutBoxStyle(layoutBox_iconColumn, 'columns', false).minHeight,
    ).toBe(layoutBox_iconColumn.rowSpan * Designs.constants.UnitPixelSize);
  });

  it('gives a band under a fixed height its flex share of the rows', () => {
    expect(resolveLayoutBoxStyle(mixedBand, 'rows', true)).toEqual({
      flexGrow: mixedBand.rowUnits.scaling,
      flexShrink: 1,
      flexBasis: mixedBand.rowUnits.fixed * Designs.constants.UnitPixelSize,
      minHeight: 0,
    });
  });

  it('ignores the content fit under a fixed height', () => {
    expect(resolveLayoutBoxStyle(layoutBox_text, 'rows', true).minHeight).toBe(
      0,
    );
    expect(
      resolveLayoutBoxStyle(layoutBox_text, 'columns', true).minHeight,
    ).toBeUndefined();
  });

  it('stretches a column box under a fixed height to its band', () => {
    expect(
      resolveLayoutBoxStyle(layoutBox_iconColumn, 'columns', true),
    ).toEqual({
      flexGrow: 0,
      flexShrink: 0,
      flexBasis:
        layoutBox_iconColumn.columnUnits.fixed *
        Designs.constants.UnitPixelSize,
    });
  });

  it('leaves the root under a fixed height to fill the render', () => {
    expect(resolveLayoutBoxStyle(mixedBand, null, true)).toEqual({});
  });
});

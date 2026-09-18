import { describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import {
  DesignElementFixtures,
  LayoutBoxFixtures,
} from '@minddrop/designs-next/test-utils';
import { resolveAtomElementStyle } from './resolveAtomElementStyle';

const {
  coverDesignElement,
  designElement_bottomBar,
  designElement_fluidCover,
  iconDesignElement,
  titleDesignElement,
} = DesignElementFixtures;
const { layoutBox_coverBand } = LayoutBoxFixtures;

describe('resolveAtomElementStyle', () => {
  it('stretches a full-width fluid element across the box', () => {
    const style = resolveAtomElementStyle(
      coverDesignElement,
      layoutBox_coverBand,
    );

    expect(style.left).toBe('0px');
    expect(style.width).toBe('100%');
  });

  it('keeps the gaps beside a fluid element at their unit width', () => {
    const style = resolveAtomElementStyle(
      titleDesignElement,
      layoutBox_coverBand,
    );

    expect(style.left).toBe(
      `${titleDesignElement.column * Designs.constants.UnitPixelSize}px`,
    );
    expect(style.width).toBe('calc(100% - 80px)');
  });

  it('holds a right-pinned element against the box right edge', () => {
    const style = resolveAtomElementStyle(
      iconDesignElement,
      layoutBox_coverBand,
    );

    // The title beside the icon absorbs the width, so the icon
    // starts after the title's scaling columns.
    expect(style.left).toBe('calc(48px + 100% - 80px)');
    expect(style.width).toBe(
      `${iconDesignElement.columnSpan * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('places a top-pinned element at its unit height from the box top', () => {
    const style = resolveAtomElementStyle(titleDesignElement, {
      ...layoutBox_coverBand,
      row: 4,
    });

    expect(style.top).toBe(
      `${(titleDesignElement.row - 4) * Designs.constants.UnitPixelSize}px`,
    );
    expect(style.height).toBe(
      `${titleDesignElement.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('holds a bottom-pinned element against the box bottom edge', () => {
    // The bottom bar moved into the band's last four rows
    const bar = { ...designElement_bottomBar, row: 12, rowSpan: 4 };
    const style = resolveAtomElementStyle(bar, {
      ...layoutBox_coverBand,
      elements: [coverDesignElement, bar],
    });

    // The gap above the bar takes whatever height the box gains
    expect(style.top).toBe('calc(100% - 16px)');
    expect(style.height).toBe(
      `${bar.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('stretches a fluid-height element with the box', () => {
    const style = resolveAtomElementStyle(designElement_fluidCover, {
      ...layoutBox_coverBand,
      elements: [designElement_fluidCover, titleDesignElement],
    });

    expect(style.top).toBe('0px');
    expect(style.height).toBe('100%');
  });
});

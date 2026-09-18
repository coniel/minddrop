import { describe, expect, it } from 'vitest';
import { Designs, LayoutAtomBox } from '@minddrop/designs-next';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { resolveAtomElementStyle } from './resolveAtomElementStyle';

const { coverDesignElement, iconDesignElement, titleDesignElement } =
  DesignElementFixtures;

// The band the cover, title and icon share, as an atomic box
const coverAtom: LayoutAtomBox = {
  type: 'atom',
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 16,
  columnUnits: { fixed: 0, scaling: 48 },
  elements: [coverDesignElement, titleDesignElement, iconDesignElement],
};

describe('resolveAtomElementStyle', () => {
  it('stretches a full-width fluid element across the box', () => {
    const style = resolveAtomElementStyle(coverDesignElement, coverAtom);

    expect(style.left).toBe('0px');
    expect(style.width).toBe('100%');
  });

  it('keeps the gaps beside a fluid element at their unit width', () => {
    const style = resolveAtomElementStyle(titleDesignElement, coverAtom);

    expect(style.left).toBe('8px');
    expect(style.width).toBe('calc(100% - 80px)');
  });

  it('holds a right-pinned element against the box right edge', () => {
    const style = resolveAtomElementStyle(iconDesignElement, coverAtom);

    // The title beside the icon absorbs the width, so the icon sits
    // its fixed columns past the title's scaling ones.
    expect(style.left).toBe('calc(48px + 100% - 80px)');
    expect(style.width).toBe('24px');
  });

  it('places the element rows at their unit height from the box top', () => {
    const style = resolveAtomElementStyle(titleDesignElement, {
      ...coverAtom,
      row: 4,
    });

    expect(style.top).toBe(
      (titleDesignElement.row - 4) * Designs.constants.UnitPixelSize,
    );
    expect(style.height).toBe(
      titleDesignElement.rowSpan * Designs.constants.UnitPixelSize,
    );
  });
});

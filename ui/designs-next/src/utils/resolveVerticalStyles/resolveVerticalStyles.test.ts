import { describe, expect, it } from 'vitest';
import { UnitPixelSize, resolveRowLayout } from '@minddrop/designs-next';
import {
  bodyDesignElement,
  cardDesign_1,
  coverDesignElement,
} from '@minddrop/designs-next/test-utils';
import { resolveVerticalStyles } from './resolveVerticalStyles';

describe('resolveVerticalStyles', () => {
  it('resolves against the card height when aspect-locked', () => {
    // A full-height fluid cover in a locked card
    const styles = resolveVerticalStyles(
      { ...coverDesignElement, rowSpan: 32 },
      { ...cardDesign_1, elements: [{ ...coverDesignElement, rowSpan: 32 }] },
      256,
      null,
    );

    expect(styles).toEqual({ top: 0, height: 256 });
  });

  it('sizes fixed elements from their block span otherwise', () => {
    const rowLayout = resolveRowLayout(cardDesign_1.elements, 32, {});
    const styles = resolveVerticalStyles(
      coverDesignElement,
      cardDesign_1,
      null,
      rowLayout,
    );

    expect(styles).toEqual({
      top: 0,
      height: coverDesignElement.rowSpan * UnitPixelSize,
      minHeight: undefined,
    });
  });

  it('gives natural elements a minimum height instead of a fixed one', () => {
    const rowLayout = resolveRowLayout(cardDesign_1.elements, 32, {});
    const styles = resolveVerticalStyles(
      bodyDesignElement,
      cardDesign_1,
      null,
      rowLayout,
    );

    expect(styles.height).toBeUndefined();
    expect(styles.minHeight).toBe(bodyDesignElement.rowSpan * UnitPixelSize);
  });
});

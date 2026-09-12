import { describe, expect, it } from 'vitest';
import { DesignElement, Designs } from '@minddrop/designs-next';
import {
  bodyDesignElement,
  cardDesign_1,
  coverDesignElement,
} from '@minddrop/designs-next/test-utils';
import { resolveVerticalStyles } from './resolveVerticalStyles';

describe('resolveVerticalStyles', () => {
  it('resolves against the card height when aspect-locked', () => {
    // A full-height fluid cover in a locked card
    const cover: DesignElement = {
      ...coverDesignElement,
      rowSpan: 32,
      heightMode: 'fluid',
    };
    const styles = resolveVerticalStyles(
      cover,
      { ...cardDesign_1, elements: [cover] },
      256,
      null,
    );

    expect(styles).toEqual({ top: 0, height: 256 });
  });

  it('sizes fixed elements from their block span otherwise', () => {
    const rowLayout = Designs.resolveRowLayout(cardDesign_1.elements, 32, {});
    const styles = resolveVerticalStyles(
      coverDesignElement,
      cardDesign_1,
      null,
      rowLayout,
    );

    expect(styles).toEqual({
      top: 0,
      height: coverDesignElement.rowSpan * Designs.constants.UnitPixelSize,
      minHeight: undefined,
    });
  });

  it('gives natural elements a minimum height instead of a fixed one', () => {
    const rowLayout = Designs.resolveRowLayout(cardDesign_1.elements, 32, {});
    const styles = resolveVerticalStyles(
      bodyDesignElement,
      cardDesign_1,
      null,
      rowLayout,
    );

    expect(styles.height).toBeUndefined();
    expect(styles.minHeight).toBe(
      bodyDesignElement.rowSpan * Designs.constants.UnitPixelSize,
    );
  });
});

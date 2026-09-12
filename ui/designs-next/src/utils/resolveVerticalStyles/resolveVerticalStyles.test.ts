import { describe, expect, it } from 'vitest';
import { DesignElement, Designs } from '@minddrop/designs-next';
import {
  bodyDesignElement,
  cardDesign_1,
  coverDesignElement,
} from '@minddrop/designs-next/test-utils';
import { resolveVerticalStyles } from './resolveVerticalStyles';

// The body's block height in pixels
const bodyBlockHeight =
  bodyDesignElement.rowSpan * Designs.constants.UnitPixelSize;

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

  it('positions elements at their row top otherwise', () => {
    const rowLayout = Designs.resolveRowLayout(cardDesign_1.elements, 32, {});
    const styles = resolveVerticalStyles(
      bodyDesignElement,
      cardDesign_1,
      null,
      rowLayout,
    );

    expect(styles.top).toBe(rowLayout.tops[bodyDesignElement.row]);
  });

  it('sizes fixed elements from their block span', () => {
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
    });
  });

  it('gives growing elements their block span as a minimum height', () => {
    const rowLayout = Designs.resolveRowLayout(cardDesign_1.elements, 32, {});
    const styles = resolveVerticalStyles(
      bodyDesignElement,
      cardDesign_1,
      null,
      rowLayout,
    );

    expect(styles.height).toBeUndefined();
    expect(styles.minHeight).toBe(bodyBlockHeight);
    expect(styles.maxHeight).toBeUndefined();
  });

  it('gives shrinking elements their block span as a maximum height', () => {
    const rowLayout = Designs.resolveRowLayout(cardDesign_1.elements, 32, {});
    const styles = resolveVerticalStyles(
      { ...bodyDesignElement, contentFit: 'shrink' },
      cardDesign_1,
      null,
      rowLayout,
    );

    expect(styles.height).toBeUndefined();
    expect(styles.minHeight).toBeUndefined();
    expect(styles.maxHeight).toBe(bodyBlockHeight);
  });

  it('leaves natural elements height to their content', () => {
    const rowLayout = Designs.resolveRowLayout(cardDesign_1.elements, 32, {});
    const styles = resolveVerticalStyles(
      { ...bodyDesignElement, contentFit: 'natural' },
      cardDesign_1,
      null,
      rowLayout,
    );

    expect(styles.height).toBeUndefined();
    expect(styles.minHeight).toBeUndefined();
    expect(styles.maxHeight).toBeUndefined();
  });
});

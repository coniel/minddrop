import { describe, expect, it } from 'vitest';
import {
  bodyDesignElement,
  cardRows,
  designElements,
  iconDesignElement,
  titleDesignElement,
} from '../../test-utils';
import { applyElementSettings } from './applyElementSettings';

describe('applyElementSettings', () => {
  it('merges the settings into the target element', () => {
    const { elements } = applyElementSettings(
      designElements,
      titleDesignElement.id,
      { bold: true },
      { rows: cardRows },
    );

    expect(elements[1]).toEqual({ ...titleDesignElement, bold: true });
  });

  it('returns the input unchanged for an unknown element', () => {
    const result = applyElementSettings(
      designElements,
      'element_missing',
      { bold: true },
      { rows: cardRows },
    );

    expect(result.elements).toBe(designElements);
    expect(result.rows).toBe(cardRows);
  });

  it('floors the span at the new minimum', () => {
    const { elements } = applyElementSettings(
      designElements,
      titleDesignElement.id,
      { level: 1 },
      { rows: cardRows, minRowSpan: 8 },
    );

    // Title span 4 grows to the new minimum
    expect(elements[1].rowSpan).toBe(8);
  });

  it('re-quantizes the span onto the new step', () => {
    const { elements } = applyElementSettings(
      designElements,
      titleDesignElement.id,
      { level: 1 },
      { rows: cardRows, minRowSpan: 6, rowSpanStep: 6 },
    );

    // Title span 4 rounds to one whole step
    expect(elements[1].rowSpan).toBe(6);
  });

  it('keeps the line count when the step changes', () => {
    const { elements, rows } = applyElementSettings(
      [{ ...titleDesignElement, rowSpan: 8 }, bodyDesignElement],
      titleDesignElement.id,
      { level: 3 },
      {
        rows: cardRows,
        minRowSpan: 5,
        rowSpanStep: 5,
        previousRowSpanStep: 8,
      },
    );

    // One 8-unit line maps to one 5-unit line, not two
    expect(elements[0].rowSpan).toBe(5);

    // The body 2 units below follows the shrink up with the rows
    expect(elements[1].row).toBe(bodyDesignElement.row - 3);
    expect(rows).toBe(cardRows - 3);
  });

  it('grows line-preserved spans and makes room below', () => {
    const { elements, rows } = applyElementSettings(
      [{ ...titleDesignElement, rowSpan: 12 }, bodyDesignElement],
      titleDesignElement.id,
      { level: 1 },
      {
        rows: cardRows,
        minRowSpan: 8,
        rowSpanStep: 8,
        previousRowSpanStep: 6,
      },
    );

    // Two 6-unit lines map to two 8-unit lines
    expect(elements[0].rowSpan).toBe(16);

    // The body overlaps the title's rows and reaches below it, so
    // the band bottom holds and nothing moves.
    expect(elements[1].row).toBe(bodyDesignElement.row);
    expect(rows).toBe(cardRows);
  });

  it('shifts a tight gap below down by the growth', () => {
    const { elements, rows } = applyElementSettings(
      [
        titleDesignElement,
        iconDesignElement,
        { ...bodyDesignElement, row: 16 },
      ],
      titleDesignElement.id,
      { level: 1 },
      { rows: cardRows, minRowSpan: 6, rowSpanStep: 6 },
    );

    // Title at rows 10-14 grew by 2 with the body 2 units below it,
    // so the tight gap holds: the body shifts down while the icon
    // beside the title holds.
    expect(elements[2].row).toBe(18);
    expect(elements[1].row).toBe(iconDesignElement.row);

    // The design's rows grow by the same delta
    expect(rows).toBe(cardRows + 2);
  });

  it('absorbs growth into a gap over the threshold', () => {
    const { elements, rows } = applyElementSettings(
      [titleDesignElement, bodyDesignElement],
      titleDesignElement.id,
      { level: 1 },
      { rows: cardRows, minRowSpan: 6, rowSpanStep: 6 },
    );

    // Title at rows 10-14 grew by 2 with the body 6 units below it,
    // so the growth absorbs into the gap instead of shifting.
    expect(elements[1].row).toBe(bodyDesignElement.row);
    expect(rows).toBe(cardRows);
  });

  it('pushes below once a large gap is consumed', () => {
    const { elements, rows } = applyElementSettings(
      [titleDesignElement, bodyDesignElement],
      titleDesignElement.id,
      { level: 1 },
      { rows: cardRows, minRowSpan: 12 },
    );

    // Title at rows 10-14 grew by 8 into the 6-unit gap below, so
    // the body shifts by the 2 units that outgrow the gap.
    expect(elements[0].rowSpan).toBe(12);
    expect(elements[1].row).toBe(bodyDesignElement.row + 2);
    expect(rows).toBe(cardRows + 2);
  });

  it('holds when a neighbour reaches the band bottom', () => {
    const { elements, rows } = applyElementSettings(
      [
        { ...iconDesignElement, row: 10, rowSpan: 8 },
        { ...titleDesignElement, rowSpan: 8 },
        bodyDesignElement,
      ],
      titleDesignElement.id,
      { level: 3 },
      {
        rows: cardRows,
        minRowSpan: 5,
        rowSpanStep: 5,
        previousRowSpanStep: 8,
      },
    );

    // The equal-height neighbour still reaches the band bottom, so
    // shrinking the title moves nothing below it.
    expect(elements[1].rowSpan).toBe(5);
    expect(elements[2].row).toBe(bodyDesignElement.row);
    expect(rows).toBe(cardRows);
  });

  it('shifts only past a neighbour reaching below the block', () => {
    const { elements, rows } = applyElementSettings(
      [
        { ...iconDesignElement, row: 10, rowSpan: 8 },
        titleDesignElement,
        bodyDesignElement,
      ],
      titleDesignElement.id,
      { level: 1 },
      { rows: cardRows, minRowSpan: 12 },
    );

    // Title at rows 10-14 grew to 22, moving the band bottom held
    // at 18 by the neighbour down by 4; the body 2 units below the
    // band follows the full movement.
    expect(elements[1].rowSpan).toBe(12);
    expect(elements[2].row).toBe(bodyDesignElement.row + 4);
    expect(rows).toBe(cardRows + 4);
  });

  it('keeps tight bottom padding when growing at the card bottom', () => {
    const { rows } = applyElementSettings(
      designElements,
      bodyDesignElement.id,
      { level: 1 },
      { rows: cardRows, minRowSpan: 12 },
    );

    // The body's bottom edge sits 2 units above the card's, so the
    // padding holds and the rows grow by the full delta.
    expect(rows).toBe(cardRows + 2);
  });

  it('pulls a tight gap up when the span shrinks', () => {
    const { elements, rows } = applyElementSettings(
      [{ ...titleDesignElement, rowSpan: 6 }, bodyDesignElement],
      titleDesignElement.id,
      { level: 3 },
      { rows: cardRows, minRowSpan: 5, rowSpanStep: 5 },
    );

    // The span re-quantizes down onto the new step
    expect(elements[0].rowSpan).toBe(5);

    // Title at rows 10-16 shrank by 1 with the body 4 units below
    // it, so the tight gap holds: the body and rows follow up.
    expect(elements[1].row).toBe(bodyDesignElement.row - 1);
    expect(rows).toBe(cardRows - 1);
  });

  it('leaves elements put when shrinking under a large gap', () => {
    const { elements, rows } = applyElementSettings(
      [
        { ...titleDesignElement, rowSpan: 6 },
        { ...bodyDesignElement, row: 24 },
      ],
      titleDesignElement.id,
      { level: 3 },
      { rows: cardRows, minRowSpan: 5, rowSpanStep: 5 },
    );

    // The gap below is over the threshold, so it simply widens
    expect(elements[0].rowSpan).toBe(5);
    expect(elements[1].row).toBe(24);
    expect(rows).toBe(cardRows);
  });

  it('shrinks the rows with tight bottom padding', () => {
    const { rows } = applyElementSettings(
      designElements,
      bodyDesignElement.id,
      { level: 3 },
      {
        rows: cardRows,
        minRowSpan: 5,
        rowSpanStep: 5,
        previousRowSpanStep: 10,
      },
    );

    // The body's bottom edge sits 2 units above the card's, so the
    // padding holds and the rows shrink with the block.
    expect(rows).toBe(cardRows - 5);
  });

  it('leaves the span alone without height constraints', () => {
    const { elements, rows } = applyElementSettings(
      designElements,
      titleDesignElement.id,
      { italic: true },
      { rows: cardRows },
    );

    expect(elements[1].rowSpan).toBe(titleDesignElement.rowSpan);
    expect(rows).toBe(cardRows);
  });
});

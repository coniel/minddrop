import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { LayoutRegion } from '../../types';
import { resolveCutLines } from './resolveCutLines';

const {
  designElement_besideIcon_1,
  designElement_besideText,
  designElement_stackedBody,
  designElement_stackedHeading,
} = DesignElementFixtures;

// The region the stacked elements sit in: their rows, full width
const stackedRegion: LayoutRegion = {
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 24,
};

describe('resolveCutLines', () => {
  it('keeps the horizontal lines no element straddles', () => {
    // The heading and the body touch, so only the line between them
    // is free.
    expect(
      resolveCutLines(
        [designElement_stackedHeading, designElement_stackedBody],
        stackedRegion,
        'rows',
      ),
    ).toEqual([designElement_stackedBody.row]);
  });

  it('leaves out the region edges', () => {
    expect(
      resolveCutLines(
        [designElement_stackedHeading],
        { ...stackedRegion, rowSpan: designElement_stackedHeading.rowSpan },
        'rows',
      ),
    ).toEqual([]);
  });

  it('cuts a gap off at its edges only', () => {
    // The body moved down to row 12, leaving four empty rows below
    // the heading.
    expect(
      resolveCutLines(
        [
          designElement_stackedHeading,
          { ...designElement_stackedBody, row: 12 },
        ],
        { ...stackedRegion, rowSpan: 28 },
        'rows',
      ),
    ).toEqual([designElement_stackedHeading.rowSpan, 12]);
  });

  it('keeps the vertical lines no element straddles', () => {
    // The gap between the icon and the text is cut off at its edges
    expect(
      resolveCutLines(
        [designElement_besideIcon_1, designElement_besideText],
        { column: 0, row: 0, columnSpan: 48, rowSpan: 22 },
        'columns',
      ),
    ).toEqual([
      designElement_besideIcon_1.columnSpan,
      designElement_besideText.column,
    ]);
  });

  it('cuts nowhere without elements', () => {
    expect(
      resolveCutLines(
        [],
        { column: 0, row: 0, columnSpan: 4, rowSpan: 4 },
        'rows',
      ),
    ).toEqual([]);
  });
});

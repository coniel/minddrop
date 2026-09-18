import { describe, expect, it } from 'vitest';
import {
  designElement_besideIcon_1,
  designElement_besideText,
  designElement_stackedBody,
  designElement_stackedHeading,
} from '../../test-utils';
import { LayoutRegion } from '../../types';
import { resolveCutLines } from './resolveCutLines';

// The region the stacked elements sit in: their rows, full width
const stackedRegion: LayoutRegion = {
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 24,
};

describe('resolveCutLines', () => {
  it('keeps the horizontal lines no element straddles', () => {
    // The heading spans rows 0-7 and the body rows 8-23, so only the
    // line between them is free.
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
    // Rows 8-11 are empty between the heading and the body
    expect(
      resolveCutLines(
        [
          designElement_stackedHeading,
          { ...designElement_stackedBody, row: 12 },
        ],
        { ...stackedRegion, rowSpan: 28 },
        'rows',
      ),
    ).toEqual([8, 12]);
  });

  it('keeps the vertical lines no element straddles', () => {
    // The icon spans columns 0-5 and the text columns 8-47, with the
    // gap between them cut off at its edges.
    expect(
      resolveCutLines(
        [designElement_besideIcon_1, designElement_besideText],
        { column: 0, row: 0, columnSpan: 48, rowSpan: 22 },
        'columns',
      ),
    ).toEqual([6, 8]);
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

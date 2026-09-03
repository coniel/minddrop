import { describe, expect, it } from 'vitest';
import { coverElement, titleElement } from '../../test-utils';
import { rowsOverlap } from './rowsOverlap';

describe('rowsOverlap', () => {
  it('returns true when the elements share rows', () => {
    expect(rowsOverlap(coverElement, titleElement)).toBe(true);
  });

  it('returns false when the elements are in disjoint rows', () => {
    expect(rowsOverlap(coverElement, { ...titleElement, row: 20 })).toBe(false);
  });

  it('returns false when the elements only touch edges', () => {
    expect(
      rowsOverlap(coverElement, {
        ...titleElement,
        row: coverElement.row + coverElement.rowSpan,
      }),
    ).toBe(false);
  });
});

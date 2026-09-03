import { describe, expect, it } from 'vitest';
import { iconElement, titleElement } from '../../test-utils';
import { columnsOverlap } from './columnsOverlap';

describe('columnsOverlap', () => {
  it('returns true when the elements share columns', () => {
    expect(columnsOverlap(titleElement, { ...iconElement, column: 20 })).toBe(
      true,
    );
  });

  it('returns false when the elements are in disjoint columns', () => {
    expect(columnsOverlap(titleElement, iconElement)).toBe(false);
  });

  it('returns false when the elements only touch edges', () => {
    expect(
      columnsOverlap(titleElement, {
        ...iconElement,
        column: titleElement.column + titleElement.columnSpan,
      }),
    ).toBe(false);
  });
});

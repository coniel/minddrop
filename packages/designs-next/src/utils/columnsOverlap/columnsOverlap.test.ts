import { describe, expect, it } from 'vitest';
import { iconDesignElement, titleDesignElement } from '../../test-utils';
import { columnsOverlap } from './columnsOverlap';

describe('columnsOverlap', () => {
  it('returns true when the elements share columns', () => {
    expect(
      columnsOverlap(titleDesignElement, { ...iconDesignElement, column: 20 }),
    ).toBe(true);
  });

  it('returns false when the elements are in disjoint columns', () => {
    expect(columnsOverlap(titleDesignElement, iconDesignElement)).toBe(false);
  });

  it('returns false when the elements only touch edges', () => {
    expect(
      columnsOverlap(titleDesignElement, {
        ...iconDesignElement,
        column: titleDesignElement.column + titleDesignElement.columnSpan,
      }),
    ).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { bodyDesignElement } from '@minddrop/designs-next/test-utils';
import { resolveElementLineRowSpan } from './resolveElementLineRowSpan';

describe('resolveElementLineRowSpan', () => {
  it('resolves the rows a line needs at the element font size', () => {
    // 20px text needs seven units a line
    expect(
      resolveElementLineRowSpan({ ...bodyDesignElement, fontSize: 20 }),
    ).toBe(7);
  });

  it('resolves at the default size without one', () => {
    // 14px text needs five units a line
    expect(resolveElementLineRowSpan(bodyDesignElement)).toBe(5);
  });
});

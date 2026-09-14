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

  it('resolves the rows a line needs at the element line height', () => {
    // 20px text at 1 needs five units a line
    expect(
      resolveElementLineRowSpan({
        ...bodyDesignElement,
        fontSize: 20,
        lineHeight: 1,
      }),
    ).toBe(5);
  });

  it('resolves at the default size without one', () => {
    // 14px text needs five units a line
    expect(resolveElementLineRowSpan(bodyDesignElement)).toBe(5);
  });
});
